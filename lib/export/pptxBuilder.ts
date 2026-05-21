import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";
import Automizer from "pptx-automizer";
import { SLIDE_LAYOUT } from "@/data/export/slideTemplates";
import type { PresentationExport, PresentationSlide } from "@/types/presentation-export";
import { collectSlidesForExport } from "@/lib/export/presentationGenerator";

const TEMPLATE_PATH = path.join(process.cwd(), "templates", "Template.pptx");

function layoutSlide(pptx: PptxGenJS, slide: PresentationSlide, index: number): void {
  const s = pptx.addSlide({ masterName: SLIDE_LAYOUT.masterName });
  const m = SLIDE_LAYOUT.marginIn;

  s.addText(slide.slideTitle, {
    x: m,
    y: m,
    w: 9 - m * 2,
    h: 0.45,
    fontSize: SLIDE_LAYOUT.titleSize,
    fontFace: SLIDE_LAYOUT.fontFace,
    color: SLIDE_LAYOUT.titleColor,
    bold: true,
  });

  s.addText(slide.headline, {
    x: m,
    y: 1.05,
    w: 5.6,
    h: 0.55,
    fontSize: SLIDE_LAYOUT.headlineSize,
    fontFace: SLIDE_LAYOUT.fontFace,
    color: SLIDE_LAYOUT.accentColor,
    bold: true,
  });

  const body = slide.bodyBullets.map((b) => `• ${b}`).join("\n");
  s.addText(body, {
    x: m,
    y: 1.75,
    w: 5.6,
    h: 3.2,
    fontSize: SLIDE_LAYOUT.bodySize,
    fontFace: SLIDE_LAYOUT.fontFace,
    color: SLIDE_LAYOUT.bodyColor,
    valign: "top",
  });

  if (slide.evidenceBullets.length > 0) {
    s.addText(
      `Evidence: ${slide.evidenceBullets.slice(0, 4).join(" · ")}`,
      {
        x: m,
        y: 4.95,
        w: 5.6,
        h: 0.4,
        fontSize: SLIDE_LAYOUT.calloutSize,
        fontFace: SLIDE_LAYOUT.fontFace,
        color: SLIDE_LAYOUT.mutedColor,
      },
    );
  }

  s.addShape(pptx.ShapeType.rect, {
    x: 6.35,
    y: 1.05,
    w: 2.85,
    h: 4.0,
    fill: { color: SLIDE_LAYOUT.calloutFill },
    line: { color: SLIDE_LAYOUT.calloutBorder, width: 1 },
  });

  s.addText(slide.rhsCallout, {
    x: 6.5,
    y: 1.2,
    w: 2.55,
    h: 3.7,
    fontSize: SLIDE_LAYOUT.calloutSize,
    fontFace: SLIDE_LAYOUT.fontFace,
    color: SLIDE_LAYOUT.titleColor,
    valign: "top",
  });

  if (slide.opportunityLine && index === 0) {
    s.addText(`Opportunity: ${slide.opportunityLine}`, {
      x: m,
      y: 5.35,
      w: 5.6,
      h: 0.35,
      fontSize: SLIDE_LAYOUT.calloutSize,
      fontFace: SLIDE_LAYOUT.fontFace,
      color: SLIDE_LAYOUT.accentColor,
      bold: true,
    });
  }

  s.slideNumber = { x: 9.0, y: 5.35, fontSize: 10, color: SLIDE_LAYOUT.mutedColor };
}

export function defineConsultingMaster(pptx: PptxGenJS): void {
  pptx.defineSlideMaster({
    title: SLIDE_LAYOUT.masterName,
    background: { color: "FFFFFF" },
    margin: [0.5, 0.5, 0.5, 0.5],
  });
}

export async function buildPptxFromGenJS(
  presentation: PresentationExport,
  slideIds?: string[],
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.author = "Retail Pricing Diagnostic";
  pptx.title = presentation.presentationTitle;
  pptx.layout = "LAYOUT_16x9";
  defineConsultingMaster(pptx);

  const slides = collectSlidesForExport(presentation, slideIds);
  slides.forEach((slide, index) => layoutSlide(pptx, slide, index));

  const arrayBuffer = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}

async function buildPptxFromTemplate(
  presentation: PresentationExport,
  slideIds?: string[],
): Promise<Buffer> {
  const tmpDir = path.join(process.cwd(), ".tmp-export");
  fs.mkdirSync(tmpDir, { recursive: true });

  const automizer = new Automizer({
    templateDir: path.join(process.cwd(), "templates"),
    outputDir: tmpDir,
    removeExistingSlides: true,
  });

  const pres = automizer
    .loadRoot("Template.pptx")
    .load("Template.pptx", "template");

  const slides = collectSlidesForExport(presentation, slideIds);
  const templateSlideCount = 4;

  slides.forEach((slide, index) => {
    const templateSlide = Math.min(index + 1, templateSlideCount);
    pres.addSlide("template", templateSlide, (slideMod) => {
      const replacements: Record<string, string> = {
        Title: slide.slideTitle,
        Headline: slide.headline,
        Body: slide.bodyBullets.map((b) => `• ${b}`).join("\n"),
        Callout: slide.rhsCallout,
      };
      for (const [shapeName, text] of Object.entries(replacements)) {
        try {
          slideMod.modifyElement(shapeName, [
            (element: unknown) => {
              const textElement = element as {
                getText: () => { replace: (pattern: RegExp, value: string) => void };
              };
              textElement.getText().replace(/^[\s\S]*/, text);
            },
          ]);
        } catch {
          /* Shape names vary by template version — genjs fallback handles output */
        }
      }
    });
  });

  const stream = await pres.write("stream");
  if (Buffer.isBuffer(stream)) return stream;
  if (stream instanceof Uint8Array) return Buffer.from(stream);
  return buildPptxFromGenJS(presentation, slideIds);
}

export async function buildPresentationPptxBuffer(
  presentation: PresentationExport,
  slideIds?: string[],
): Promise<{ buffer: Buffer; usedTemplate: boolean }> {
  if (fs.existsSync(TEMPLATE_PATH)) {
    try {
      const buffer = await buildPptxFromTemplate(presentation, slideIds);
      return { buffer, usedTemplate: true };
    } catch {
      const buffer = await buildPptxFromGenJS(presentation, slideIds);
      return { buffer, usedTemplate: false };
    }
  }
  const buffer = await buildPptxFromGenJS(presentation, slideIds);
  return { buffer, usedTemplate: false };
}
