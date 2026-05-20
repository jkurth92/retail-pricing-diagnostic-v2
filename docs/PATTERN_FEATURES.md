# Pattern Features

## What is a pattern feature?

A **pattern feature** is a measurable descriptor of client pricing data — for example, “KVI revenue share” or “zone price variance.” It describes **what can be observed** from normalized uploads.

Pattern features are **not**:

- **Rules** — interpretive logic that classifies issues or triggers actions
- **Benchmarks** — external reference points or competitive thresholds
- **Opportunity sizing** — financial impact estimates
- **Recommendations** — narrative advice to the client

## Feature record

Each feature (`PatternFeature`) includes:

| Attribute | Purpose |
|-----------|---------|
| featureName | Human-readable label |
| description | What is measured |
| sourceFields | Canonical fields required |
| calculationNote | Deterministic future formula (no values yet) |
| outputType | numeric, percent, categorical, etc. |
| status | not_defined, defined, pending_alignment, ready_for_engine |
| value | `null` until engine runs |
| evidenceLinks | Which upload types supply fields |

Catalog: [`data/patternFeatureCatalog.ts`](../data/patternFeatureCatalog.ts)

## Lever inventory (Step 4)

| Lever | Feature count (approx.) | Themes |
|-------|-------------------------|--------|
| KVI | 5 | Revenue share, SKU share, concentration, breadth, visibility |
| Architecture | 7 | Ladder spacing, tier gaps, PL gap, pack consistency, monotonicity |
| Zoning | 5 | Variance, uniform share, dispersion, coverage, outliers |
| Promotions | 5 | Depth, frequency, overlap, base gap, assortment share |
| Markdown | 5 | Depth, frequency, aging, recovery, category exposure |

## Status meanings

- **not_defined** — Required canonical fields missing in normalized preview
- **defined** — Fields available; feature definition complete
- **pending_alignment** — Ready for rule pack alignment; no calculation
- **ready_for_engine** — Future: engine may compute (still no conclusions)

## Implementation

- Types: [`types/pattern-features.ts`](../types/pattern-features.ts)
- Builder: [`lib/patternFeatureBuilder.ts`](../lib/patternFeatureBuilder.ts)
- Evidence: [`lib/patternEvidence.ts`](../lib/patternEvidence.ts)

## Disabled until alignment

- Numeric feature values
- Findings and severity
- Benchmark comparisons
- Opportunity translation
