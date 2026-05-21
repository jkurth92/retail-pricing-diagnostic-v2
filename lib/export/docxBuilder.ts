import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import {
  MEMO_EXECUTIVE_ANSWER_HEADING,
  MEMO_LEADERSHIP_HEADING,
  MEMO_STRUCTURAL_THEMES_HEADING,
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
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: MEMO_EXECUTIVE_ANSWER_HEADING,
                bold: true,
                size: 26,
              }),
            ],
          }),
          bodyParagraph(
            `Potential pricing opportunity: ${memo.opportunityBreakdown.totalRange}`,
          ),
          ...memo.opportunityBreakdown.byLever.map((l) =>
            bulletParagraph(`${l.leverLabel}: ${l.marginRange}`),
          ),
          bodyParagraph(memo.opportunityBreakdown.synthesis),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: MEMO_STRUCTURAL_THEMES_HEADING,
                bold: true,
                size: 26,
              }),
            ],
          }),
          ...memo.structuralThemes.map((t) => bulletParagraph(t)),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: MEMO_LEADERSHIP_HEADING,
                bold: true,
                size: 26,
              }),
            ],
          }),
          ...memo.leadershipFocusAreas.map((q) => bulletParagraph(q)),
          bodyParagraph(memo.supportingNarrative),
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
