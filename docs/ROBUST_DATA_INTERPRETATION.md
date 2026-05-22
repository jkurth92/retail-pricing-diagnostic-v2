# Robust data interpretation (Step 15)

## Strategic positioning

The product is an **intelligent strategic pricing interpretation layer** — not a rigid ETL pipeline. It asks:

> What can we still reasonably infer from imperfect data?

## Orchestrator

`lib/robustDataInterpretation.ts` — `runRobustDataInterpretation()`

Produces `RobustDataInterpretationBundle` consumed by:

- Ingestion preview (`lib/buildIngestionPreview.ts`)
- Evidence computation (`lib/evidenceComputation.ts`)
- Storyline / opportunity aggregation (`lib/storylineSynthesizer.ts`, `lib/gracefulDegradation.ts`)
- Hypothesis engine (`lib/hypothesisEngine.ts`)
- Consultant detail UI (`components/consultant/DataInterpretationDetail.tsx`)

## Subsystems

1. **Semantic field normalization** — see `SEMANTIC_FIELD_NORMALIZATION.md`
2. **Category normalization** — `lib/categoryNormalization.ts`, `lib/retailerCategoryMappings.ts`
3. **Proxy signals** — see `PROXY_SIGNAL_GENERATION.md`
4. **Evidence coverage** — `lib/evidenceCoverage.ts` (weighted sufficiency)
5. **Data quality** — `lib/dataQualityAssessment.ts`
6. **Graceful degradation** — see `GRACEFUL_DEGRADATION.md`

## Why directional outputs are preserved

- Partial architecture evidence + proxy tiers still inform benchmark calibration
- Opportunity sizing remains thematic and bounded — widened, not fabricated
- Unsupported themes (e.g. promo without fields) are still suppressed

## What remains placeholder

- **Real CSV row parsing** — pricing rows still use deterministic synthesis until upload parser is aligned
- **Live column detection** — preview uses `PLACEHOLDER_DETECTED_COLUMNS`
- **LLM / embedding matchers** — not used; all matching is deterministic

## Auditability

Every inference exposes:

- Source column → canonical mapping + confidence
- Category alias → normalized category
- Proxy signal label + detail string
- Sufficiency dimension notes in consultant disclosure
