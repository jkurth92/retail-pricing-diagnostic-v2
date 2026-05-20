# Data Readiness Model

## Purpose

Describe how upload and normalization progress will be scored **before** diagnostic rules run. Step 3 defines types and placeholder UI only — no live scoring.

## Readiness states

| State | Meaning |
|-------|---------|
| not_uploaded | No file received for this type |
| partially_uploaded | File received but incomplete vs file schema |
| upload_complete | File meets required columns for its type |
| normalization_partial | Some canonical fields populated |
| normalization_complete | Canonical record rules satisfied for scope |
| diagnostics_limited | Some levers have minimum evidence; others do not |
| diagnostics_ready | Minimum canonical coverage for selected levers (rules still require alignment) |

States are **descriptive** in the UI until parsing is implemented. Current build: all uploads remain `not_uploaded`.

## Scoring dimensions (descriptive only)

| Metric | Description | Step 3 value |
|--------|-------------|--------------|
| fieldCoveragePct | Share of required canonical fields populated | `null` (Pending) |
| fileCoveragePct | Share of expected file types uploaded | `null` (Pending) |
| rowCoveragePct | Share of rows passing validation | `null` (Pending) |
| diagnosticCoveragePct | Share of selected levers with minimum evidence | `null` (Pending) |
| dataQualityNotes | Analyst-facing quality flags | Placeholder notes |

**No business opportunity** is calculated from these metrics.

## Diagnostic availability

Per lever (`kvis`, `price_architecture`, `price_zoning`, `promotions`, `markdown`):

- **unavailable** — Missing required canonical fields
- **limited** — Required fields present; recommended fields missing
- **available** — Minimum evidence present (future; rules must still be aligned)

Derived from [`data/diagnosticAvailabilityMatrix.ts`](../data/diagnosticAvailabilityMatrix.ts).

## Upload file readiness card

Each file type shows:

- Readiness state
- Normalization: `Pending normalization` vs `Ready for diagnostic use`
- Missing required / recommended canonical fields
- Which diagnostics the file can unlock (when normalized)
- Per-file score placeholders

Implemented in UI: `UploadFileReadinessCard`, `DataReadinessPanel`.

## Types and data

- [`types/data-readiness.ts`](../types/data-readiness.ts)
- [`data/uploadReadinessModel.ts`](../data/uploadReadinessModel.ts)

## Future parsing flow

1. Upload → `partially_uploaded` / `upload_complete`
2. Map columns → `normalization_partial`
3. Validate & join → `normalization_complete`
4. Score levers → `diagnostics_limited` or `diagnostics_ready`
5. Engine checks rules (separate alignment) before generating patterns

## Guardrails

- Readiness does not imply opportunity size
- Readiness does not apply benchmark thresholds
- Context documents do not map to canonical pricing rows
- No fake percentages in Step 3 UI
