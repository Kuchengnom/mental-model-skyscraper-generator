# Skyline - Mental Model Diagram Generator

A tool for generating [Mental Model Diagrams](https://indiyoung.com/method/#mmskyline) in the style of Indi Young. Upload a spreadsheet and get a skyline diagram you can export as SVG.

## Using the app

### Live version

[kuchengnom.github.io/mental-model-skyscraper-generator](https://kuchengnom.github.io/mental-model-skyscraper-generator/)

---

## Spreadsheet format

The app reads `.xlsx` files. Each row represents one item in the diagram. Columns carry forward — you only need to repeat a value when it changes.

| Col | Field | Purpose |
|-----|-------|---------|
| A | Mental Space | Top-level section (a group of related towers) |
| B | Task Tower | Column within a Mental Space |
| C | Atomic Task | A single task, thought, or feeling (upper skyline section) |
| D | Support Type | Type of supporting item below the baseline: `Source`, `Tool`, `Content`, or `Feature` |
| E | Support Item | Label for the supporting item |

**Columns D and E are optional.** Files without them render the skyline section only.

### Example layout

```
Mental Space      | Task Tower    | Atomic Task              | Support Type | Support Item
------------------+---------------+--------------------------+--------------+-------------------
Finding a route   | Planning      | Check the map            |              |
                  |               | Ask a local              |              |
                  |               |                          | Tool         | Maps app
                  |               |                          | Content      | Tourist guide
                  | Navigating    | Follow street signs      |              |
                  |               |                          | Source       | City website
Booking a hotel   | Comparing     | Read reviews             |              |
                  |               | Compare prices           |              |
                  |               |                          | Feature      | Price filter
```

**Important:** the spreadsheet must be sorted by Mental Space, then by Task Tower. If rows are out of order, the diagram will mis-render.

### Support type colors

Items in the lower section are color-coded by type:

| Type | Color |
|------|-------|
| Source | Blue `#D4E6F1` |
| Tool | Green `#D5F5E3` |
| Content | Orange `#FDEBD0` |
| Feature | Purple `#E8DAEF` |

---

## Workflow

1. Open the app and click **Open Spreadsheet** to upload your `.xlsx` file.
2. The diagram renders immediately in the right panel.
3. Edit cells directly in the left panel — the diagram updates live.
4. Use **Settings** to adjust colors, fonts, and sizes for each diagram element.
5. Click **Save Diagram** to download the result as an SVG file.
6. Click **Save Spreadsheet** to download your edited data as `.xlsx`.

---

## Building from source

### Install dependencies

```sh
npm install
```

### Development server

```sh
npm run dev
```

Opens at `http://localhost:3000`.

### Generate static files for deployment

```sh
npm run generate
```

Optional `basePath` argument for subdirectory deployments:

```sh
npm run generate --basePath='/skyline/'
```

