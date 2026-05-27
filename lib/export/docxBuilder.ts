import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import {
  MEMO_DISCUSSION_HEADING,
  MEMO_IMPLICATIONS_HEADING,
  MEMO_PRICING_OBSERVATIONS_HEADING,
  MEMO_RETAILER_CONTEXT_HEADING,
} from "@/data/export/memoTemplates";
import type { ExecutiveMemo } from "@/types/executive-memo";

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function headingParagraph(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26 })],
  });
}

function bodyFromMultiline(block: string): Paragraph[] {
  const lines = block.split("\n");
  const out: Paragraph[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("•")) {
      out.push(bulletParagraph(trimmed.replace(/^•\s*/, "")));
    } else {
      out.push(bodyParagraph(trimmed));
    }
  }
  return out;
}

export function buildExecutiveMemoDocument(memo: ExecutiveMemo): Document {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
            children: [new TextRun({ text: memo.title, bold: true, size: 32 })],
          }),
          headingParagraph(MEMO_RETAILER_CONTEXT_HEADING),
          ...bodyFromMultiline(memo.retailerContext),
          headingParagraph(MEMO_PRICING_OBSERVATIONS_HEADING),
          ...bodyFromMultiline(memo.pricingObservations),
          headingParagraph(MEMO_IMPLICATIONS_HEADING),
          ...bodyFromMultiline(memo.implications),
          headingParagraph(MEMO_DISCUSSION_HEADING),
          ...memo.discussionQuestions.map((q) => bulletParagraph(q)),
          ...memo.notes.map((n) =>
            new Paragraph({
              spacing: { before: 120 },
              children: [
                new TextRun({ text: n, italics: true, size: 18, color: "64748B" }),
              ],
            }),
          ),
        ],
      },
    ],
  });
}

export async function executiveMemoToBuffer(memo: ExecutiveMemo): Promise<Buffer> {
  const doc = buildExecutiveMemoDocument(memo);
  return Packer.toBuffer(doc);
}
