# Signal Generation (Step 13)

## Measurable signals

Signals are generated from computed pricing structure, not from consulting templates alone.

| Family | Examples | Source module |
|--------|----------|---------------|
| Architecture | Premium/mainstream gap, entry gap, tier spacing, PL/NB gap, compression | `architectureSignals.ts` |
| KVI | Revenue share, SKU share, category concentration | `kviSignals.ts` |
| Category | Revenue concentration, premiumization mix | `categorySignals.ts` |

Each metric carries a strength (`strong` / `moderate` / `weak`) used for overall `evidenceStrength` and opportunity calibration width.

## Mapping to hypothesis triggers

Computed measurements map to existing signal IDs (e.g. `sig-ladder-compression`, `sig-weak-pl-nb`) with explanations that cite measured values.

`mergeEvidenceWithFrameworkSignals` removes framework-fired architecture/KVI/promo signals that lack a matching computed signal, preventing generic themes from appearing without data support.

## Promo / markdown

Promo and markdown signals fire only when normalized upload fields include promo or markdown columns (`promoMarkdownEligible`). They do not dominate the default executive path.

## Suppression rules

- Hypothesis registry IDs not in `eligibleHypothesisIds` are skipped (for measured families).
- Executive theme definitions for Promotions/Markdown are skipped when promo evidence is absent.
- Low-confidence hypotheses remain suppressed per Step 6A rules.
