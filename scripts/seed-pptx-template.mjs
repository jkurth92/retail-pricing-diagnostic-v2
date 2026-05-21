/**
 * Seeds templates/Template.pptx with consulting-style master layouts.
 * Named shapes support pptx-automizer text replacement when present.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PptxGenJSImport from "pptxgenjs";
const PptxGenJS = PptxGenJSImport.default ?? PptxGenJSImport;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "templates");
const outFile = path.join(outDir, "Template.pptx");

const L = {
  titleColor: "1B2A4A",
  bodyColor: "2D3748",
  accentColor: "0F4C81",
  calloutFill: "F1F5F9",
  fontFace: "Calibri",
};

function addConsultingSlide(pptx, { title, headline, body, callout }) {
  const slide = pptx.addSlide();
  slide.addText(title, {
    placeholder: "Title",
    name: "Title",
    x: 0.55,
    y: 0.45,
    w: 8.9,
    h: 0.5,
    fontSize: 24,
    fontFace: L.fontFace,
    color: L.titleColor,
    bold: true,
  });
  slide.addText(headline, {
    placeholder: "Headline",
    name: "Headline",
    x: 0.55,
    y: 1.05,
    w: 5.5,
    h: 0.45,
    fontSize: 18,
    fontFace: L.fontFace,
    color: L.accentColor,
    bold: true,
  });
  slide.addText(body, {
    placeholder: "Body",
    name: "Body",
    x: 0.55,
    y: 1.65,
    w: 5.5,
    h: 3.5,
    fontSize: 14,
    fontFace: L.fontFace,
    color: L.bodyColor,
    valign: "top",
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.35,
    y: 1.05,
    w: 2.85,
    h: 4.0,
    fill: { color: L.calloutFill },
  });
  slide.addText(callout, {
    placeholder: "Callout",
    name: "Callout",
    x: 6.5,
    y: 1.2,
    w: 2.55,
    h: 3.7,
    fontSize: 12,
    fontFace: L.fontFace,
    color: L.titleColor,
    valign: "top",
  });
}

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.title = "Consulting Export Template";

const layouts = [
  {
    title: "Executive Summary & Opportunity",
    headline: "Directional margin opportunity",
    body: "• Architecture lever\n• KVI efficiency\n• Promotions",
    callout: "Strategic implication: Architecture-first opportunity.",
  },
  {
    title: "Architecture Deep Dive",
    headline: "Ladder structure & premiumization",
    body: "• Architecture observations\n• Supporting evidence",
    callout: "Strategic implication: Validate role design.",
  },
  {
    title: "Supporting Structural Themes",
    headline: "KVI & promotions",
    body: "• KVI concentration\n• Promo intensity",
    callout: "Strategic implication: Reinforce base-price architecture.",
  },
  {
    title: "Retailer-Specific Considerations",
    headline: "Optional appendix",
    body: "• Governance\n• Zoning\n• Lifecycle",
    callout: "Strategic implication: Client-specific validation.",
  },
];

layouts.forEach((layout) => addConsultingSlide(pptx, layout));

fs.mkdirSync(outDir, { recursive: true });
await pptx.writeFile({ fileName: outFile });
console.log(`Wrote ${outFile}`);
