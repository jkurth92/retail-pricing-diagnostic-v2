# Executive Export System

Step 11 transforms the diagnostic readout into **consulting-workflow-ready deliverables** — editable first drafts, not locked final outputs.

## Deliverable types

| Format | Generator | Purpose |
|--------|-----------|---------|
| Partner email | `lib/export/executiveEmailGenerator.ts` | Warm, strategic client follow-up |
| Executive memo (DOCX) | `lib/export/executiveMemoGenerator.ts` + `docxBuilder.ts` | One-page, answer-first leadership memo |
| Deck (PPTX) | `lib/export/presentationGenerator.ts` + `pptxBuilder.ts` | LOP-ready storyline deck |
| Storyline JSON tree | `lib/export/storylineExport.ts` | Hierarchy for future PDF/memo/PPT pipelines |

Orchestration: `lib/export/buildExportDeliverables.ts` → `exportBundle` on `runExecutiveDeliverableEngine`.

## API routes

- `POST /api/export/docx` — body: `ExecutiveMemo`
- `POST /api/export/pptx` — body: `{ presentation, slideIds? }`

## Template

`templates/Template.pptx` is the structural and visual basis for PPTX exports. Regenerate with:

```bash
node scripts/seed-pptx-template.mjs
```

When the template is present, `pptx-automizer` attempts named-shape text replacement; on failure, `pptxgenjs` produces a matching consulting layout.

## UI

**Executive exports** workflow step → `ExportPreviewPanel` with email, memo, and slide previews plus download actions.

## Intentionally absent

- PDF export (DOCX preferred initially)
- Operational recommendations or exact price prescriptions
- Dashboard-style or chart-heavy slides
- Locked / image-only deliverables
