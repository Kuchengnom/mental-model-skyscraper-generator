import { wrapText } from "~/utils/text-utils";
import svg from "~/utils/svg-builder";

export interface SupportItem {
  type: string;
  label: string;
}

export interface TowerContent {
  tasks: string[];
  supports: SupportItem[];
}

export interface DiagramData {
  [blockName: string]: {
    [towerName: string]: TowerContent;
  };
}

export interface DiagramOptions {
  block: {
    margin: number;
    padding: number;
    gap: number;
    backgroundColor: string;
    strokeColor: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
  }

  tower: {
    width: number;
    padding: number;
    gap: number;
    backgroundColor: string;
    strokeColor: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
  }

  box: {
    padding: number;
    gap: number;
    backgroundColor: string;
    strokeColor: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
  }

  support: {
    padding: number;
    gap: number;
    backgroundColor: string;
    strokeColor: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
  }
}

interface Block {
  title: string[];
  width: number;
  height: number;
  towers: Tower[];
}

interface Tower {
  title: string[];
  height: number;
  boxes: Box[];
  supports: RenderedSupportItem[];
  supportHeight: number;
}

interface Box {
  title: string[];
  height: number;
}

interface RenderedSupportItem {
  type: string;
  label: string[];
  height: number;
}

const SUPPORT_COLORS: Record<string, string> = {
  Source: "#D4E6F1",
  Tool: "#D5F5E3",
  Content: "#FDEBD0",
  Feature: "#E8DAEF",
};

function getSupportColor(type: string, fallback: string): string {
  const key = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return SUPPORT_COLORS[key] ?? fallback;
}

export function generateMentalModelDiagram(
  data: DiagramData,
  opts: DiagramOptions
): string {
  const blocks: Block[] = [];
  opts = opts as DiagramOptions;

  const supportOpts = opts.support ?? {
    padding: 8,
    gap: 8,
    backgroundColor: "#F2F3F4",
    strokeColor: "#c8c8c8",
    fontFamily: "Arial",
    fontSize: 12,
    textColor: "#333333",
  };

  let maxSupportHeight = 0;

  Object.entries(data).forEach(([blockName, towerData]) => {
    let maxTowerHeight = 0;

    const towers = Object.entries(towerData).map(([towerName, towerContent]) => {
      const tasks = Array.isArray(towerContent) ? towerContent : towerContent.tasks;
      const rawSupports: SupportItem[] = Array.isArray(towerContent) ? [] : (towerContent.supports ?? []);

      const boxes = tasks.map((content) => {
        const title = wrapText(
          content,
          opts.tower.width - 2 * opts.tower.padding,
          opts.box.fontSize,
        );
        const height = title.length * opts.box.fontSize + opts.box.padding * 2;
        return { title, height };
      });

      const title = wrapText(towerName, opts.tower.width, opts.tower.fontSize);
      const titleHeight = title.length * opts.tower.fontSize;
      const boxesHeight = boxes
        .map((box) => box.height)
        .reduce((a, b) => a + b + opts.box.gap, 0);
      const height = titleHeight + boxesHeight + opts.tower.padding * 3;

      if (height > maxTowerHeight) maxTowerHeight = height;

      const typeLineHeight = Math.round(supportOpts.fontSize * 0.85);

      const supports: RenderedSupportItem[] = rawSupports.map((s) => {
        const label = wrapText(
          s.label,
          opts.tower.width - 2 * supportOpts.padding,
          supportOpts.fontSize,
        );
        const h = typeLineHeight + label.length * supportOpts.fontSize + supportOpts.padding * 2;
        return { type: s.type, label, height: h };
      });

      const supportHeight = supports.reduce(
        (sum, s) => sum + s.height + supportOpts.gap,
        supports.length > 0 ? 0 : 0,
      );

      return { title, height, boxes, supports, supportHeight };
    });

    const towerMaxSupport = Math.max(0, ...towers.map((t) => t.supportHeight));
    if (towerMaxSupport > maxSupportHeight) maxSupportHeight = towerMaxSupport;

    const width =
      towers.length * opts.tower.width +
      (towers.length - 1) * opts.tower.gap +
      opts.block.padding * 2;
    const title = wrapText(blockName, width, opts.block.fontSize);
    const height =
      maxTowerHeight + title.length * opts.block.fontSize + opts.block.padding * 2;

    blocks.push({ title, width, height, towers });
  });

  const maxBlockHeight =
    Math.max(...blocks.map((block) => block.height)) + opts.block.padding * 2;

  const hasSupportItems = maxSupportHeight > 0;
  const totalHeight =
    opts.block.margin +
    maxBlockHeight +
    (hasSupportItems ? supportOpts.gap + maxSupportHeight + opts.block.margin : opts.block.margin);

  const svgBuilder = svg();
  let currentX = opts.block.margin;

  blocks.forEach((block) => {
    svgBuilder.group(
      { transform: `translate(${currentX}, ${opts.block.margin})` },
      (blockGroup) => {
        blockGroup.rect({
          x: 0,
          y: 0,
          width: block.width,
          height: maxBlockHeight,
          fill: opts.block.backgroundColor,
          stroke: opts.block.strokeColor,
          strokeWidth: 2,
          rx: 10,
        });

        blockGroup.textBlock(
          {
            x: opts.block.padding,
            y: opts.block.fontSize + opts.block.padding,
            "font-family": opts.block.fontFamily,
            "font-size": opts.block.fontSize,
            fill: opts.block.textColor,
          },
          block.title,
          opts.block.fontSize,
        );

        let towerX = opts.block.padding;
        block.towers.forEach((tower) => {
          const towerY = maxBlockHeight - opts.block.padding - tower.height;

          blockGroup.group(
            { transform: `translate(${towerX}, ${towerY})` },
            (towerGroup) => {
              towerGroup.rect({
                x: 0,
                y: 0,
                width: opts.tower.width,
                height: tower.height,
                fill: opts.tower.backgroundColor,
                stroke: opts.tower.strokeColor,
                "stroke-width": 2,
                rx: 10,
              });

              towerGroup.textBlock(
                {
                  x: opts.tower.padding,
                  y: opts.tower.fontSize + opts.tower.padding,
                  "font-family": opts.tower.fontFamily,
                  "font-size": opts.tower.fontSize,
                  fill: opts.tower.textColor,
                },
                tower.title,
                opts.tower.fontSize,
              );

              let currentBoxY =
                tower.title.length * opts.tower.fontSize + opts.tower.padding * 2;

              tower.boxes.forEach((box) => {
                towerGroup.rect({
                  x: opts.tower.padding,
                  y: currentBoxY,
                  width: opts.tower.width - opts.tower.padding * 2,
                  height: box.height,
                  fill: opts.box.backgroundColor,
                  stroke: opts.box.strokeColor,
                  "stroke-width": 1,
                  rx: 10,
                });

                towerGroup.textBlock(
                  {
                    x: opts.tower.padding + opts.box.padding,
                    y: currentBoxY + opts.box.fontSize + opts.box.padding,
                    "font-family": opts.box.fontFamily,
                    "font-size": opts.box.fontSize,
                    fill: opts.box.textColor,
                  },
                  box.title,
                  opts.box.fontSize,
                );

                currentBoxY += box.height + opts.box.gap;
              });
            },
          );

          // Support items below the baseline, aligned to this tower's x
          if (hasSupportItems && tower.supports.length > 0) {
            const typeLineHeight = Math.round(supportOpts.fontSize * 0.85);
            let supportY = maxBlockHeight + supportOpts.gap;

            tower.supports.forEach((support) => {
              const color = getSupportColor(support.type, supportOpts.backgroundColor);

              blockGroup.rect({
                x: towerX,
                y: supportY,
                width: opts.tower.width,
                height: support.height,
                fill: color,
                stroke: supportOpts.strokeColor,
                "stroke-width": 1,
                rx: 6,
              });

              blockGroup.text(
                {
                  x: towerX + supportOpts.padding,
                  y: supportY + typeLineHeight,
                  "font-family": supportOpts.fontFamily,
                  "font-size": Math.round(supportOpts.fontSize * 0.8),
                  fill: supportOpts.textColor,
                  "font-style": "italic",
                },
                support.type,
              );

              blockGroup.textBlock(
                {
                  x: towerX + supportOpts.padding,
                  y: supportY + typeLineHeight + supportOpts.fontSize + supportOpts.padding,
                  "font-family": supportOpts.fontFamily,
                  "font-size": supportOpts.fontSize,
                  fill: supportOpts.textColor,
                },
                support.label,
                supportOpts.fontSize,
              );

              supportY += support.height + supportOpts.gap;
            });
          }

          towerX += opts.tower.width + opts.tower.gap;
        });

        // Baseline separator between tasks and support section
        if (hasSupportItems) {
          blockGroup.rect({
            x: 0,
            y: maxBlockHeight,
            width: block.width,
            height: 3,
            fill: opts.block.strokeColor,
            stroke: "none",
            rx: 0,
          });
        }
      },
    );

    currentX += block.width + opts.block.padding * 2 + opts.block.gap;
  });

  return svgBuilder
    .width(currentX)
    .height(totalHeight)
    .build();
}
