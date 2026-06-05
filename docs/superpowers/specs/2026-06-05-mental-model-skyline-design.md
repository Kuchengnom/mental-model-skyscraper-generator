# Mental Model Skyline Generator — Design Spec
_Date: 2026-06-05_

## Overview

A static, client-side mental model skyline generator that runs on GitHub Pages. Replaces the current PHP implementation with pure HTML/CSS/JS — no server required, no build step. Users load their own CSV data at runtime; the diagram renders in the browser.

Reference: https://indiyoung.com/mental-model-diagram-generator/

---

## Architecture

**Single-page static app. No framework, no build tooling.**

- `index.html` — shell, layout, controls
- `app.js` — CSV parsing, hierarchy building, DOM rendering, filter/search logic
- `styles.css` — skyline layout, role colors, interactive states
- `sample-data.csv` — example dataset so the page isn't blank on first visit
- `.github/workflows/deploy.yml` — copies `main` to `gh-pages` on every push

Deployed to: `https://<username>.github.io/<repo>/`

No CDN dependencies except an optional Google Fonts import for typography.

---

## Data Model

CSV columns:

| Column | Purpose |
|--------|---------|
| `TID` | Unique task ID |
| `Mental Space` | Top-level grouping (horizontal sections) |
| `Task tower` | Column within a Mental Space |
| `Atomic task` | Individual task label (upper/skyline section) |
| `IsOurs` | `Yes`/`No` — relevancy flag |
| `Timeline` | `High`/`Med`/`Low`/`No` — priority |
| `ID` | Interviewee code (e.g. AH, PG) |
| `Type` | Raw role type |
| `CleanType` | Normalized role: QE, PE, UD, PM, RCM, Other |
| `Quote` | Primary interview quote |
| `Quote 2–4` | Additional quotes |
| `Support Type` | (col 3) Type of lower-section item: `Source`, `Tool`, `Content`, `Feature` |
| `Support Item` | (col 4) Label for the lower-section item |

Support rows use the running block/tower context (same as atomic tasks). A row with values in columns 3 and 4 adds a support item to the current tower's lower section. A row can have both an atomic task (col 2) and a support item (cols 3–4).

**Support type color palette (fixed):**
- Source → `#D4E6F1` (blue)
- Tool → `#D5F5E3` (green)
- Content → `#FDEBD0` (orange)
- Feature → `#E8DAEF` (purple)
- Unknown → configurable fallback color

**Pre-sort requirement:** The CSV must be sorted by Mental Space then Task tower before export (same as current). A note in the UI communicates this. The app detects out-of-order rows and shows a warning banner rather than silently mis-rendering.

---

## Data Input

Three loading modes, all rendering the same diagram:

1. **Drag-and-drop / file picker** — drop a `.csv` anywhere on the page or click a file input button. Primary interaction.
2. **Paste CSV** — a collapsible text area for pasting raw CSV text (Google Sheets copy-paste workflow).
3. **Load from URL** — an input field for a Google Sheets published CSV URL. Shows a loading indicator during fetch; surfaces CORS errors clearly.

On load, the app attempts to load `sample-data.csv` from the same directory and renders it as a default state so the page is never empty.

---

## Core Visualization

Hierarchy: **Mental Space → Task Tower → Atomic Task** (upper) + **Support Items** (lower)

### Upper section (skyline)
- Mental Spaces render as horizontal cards, laid out in a flex row that scrolls horizontally
- Task Towers are columns within each Mental Space, laid out in a flex row
- Atomic Tasks stack vertically within each tower; height varies, creating the "skyline" silhouette
- Task background color determined by `CleanType` (role), using the same palette as the current project:
  - QE `#FBDEBF`, PE `#DEF3FF`, UD `#FBEABC`, PM `#E4F5BC`, RCM `#C7BFFF`, Other `#ebebeb`
- Mental Space header is sticky so the label remains visible when scrolling tall towers

### Lower section (support)
- A 3px baseline separates the skyline from the support section (only rendered when support items exist)
- Support items sit below the baseline, aligned to their tower's x position
- Each support item shows a small italic type label (Source/Tool/Content/Feature) and a wrapped text label
- Type colors: Source `#D4E6F1`, Tool `#D5F5E3`, Content `#FDEBD0`, Feature `#E8DAEF`, unknown → user-configurable fallback
- Support section height expands to fit the tallest tower's support column; empty towers leave their column blank

### Interaction
- Clicking a task expands its quote/metadata panel inline
- Mis-sorted row warning: if a Mental Space or Task Tower value reappears after having closed, a yellow banner describes the issue

---

## Interactive Features

### Relevancy Toggle
- Hides all `IsOurs: No` tasks and their towers when no relevant task exists in the tower
- Highlights remaining tasks by Timeline: High (green border), Med (blue border), Low (neutral)
- Toggle button in the sidebar; relevancy legend appears only when active

### Role Filter
- Checkbox group (QE, PE, UD, PM, RCM, Other) — uncheck to hide tasks of that role
- Defaults to all visible
- Towers that become empty after filtering collapse (zero-height, not removed from DOM)

### Search
- Live text filter across `Atomic task` text
- Matching tasks remain visible; non-matching tasks collapse
- Search and role filter compose: a task must pass both to be visible
- Towers and Mental Spaces with no visible tasks collapse

### Shareable URL State
- Active filters (relevancy toggle, role checkboxes, search query) are encoded in the URL hash
- Navigating to a URL with hash state restores the view automatically
- Useful for sharing a filtered perspective with a colleague

### Transcript Links Panel
- List of interviewee code → transcript URL links
- Driven by a hardcoded config object in `app.js` (or optionally a second CSV tab in a future iteration)
- Links open in a new tab

---

## Out of Scope (this version)

- In-browser data editing or row creation
- Drag-to-reorder Mental Spaces or Task Towers
- PNG/SVG export
- Authentication or server-side persistence
- Multiple simultaneous datasets

---

## GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

No build step. The workflow publishes the repo root to `gh-pages` as-is.

---

## File Structure

```
index.html
app.js
styles.css
sample-data.csv
.github/
  workflows/
    deploy.yml
docs/
  superpowers/
    specs/
      2026-06-05-mental-model-skyline-design.md
README.md
```

---

## Success Criteria

- A user with a correctly-formatted CSV can drag it onto the page and see their mental model diagram within 1 second
- The diagram matches the visual structure of the current PHP version
- All filters (relevancy, role, search) work without page reload
- A filtered URL can be shared and restores the same view
- The page deploys and is accessible at the GitHub Pages URL after a push to `main`
