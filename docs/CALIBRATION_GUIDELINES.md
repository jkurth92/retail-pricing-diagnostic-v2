# Calibration Guidelines

## Constants (`data/outputCalibrationRules.ts`)

| Rule | Default | Intent |
|------|---------|--------|
| maxPrimaryThemes | 5 | Executive focus |
| maxSecondaryThemes | 2 | Supporting context only |
| maxSurfacedHypotheses | 5 | Reduce noise |
| maxThemeMarginSpanPct | 2.8 | Avoid fake precision / overly wide bands |
| marginOverlapFactor | 0.52 | Non-additive thematic totals |
| architectureFamilyBoost | 18 | Architecture-first ranking |

## Application points

- `lib/themeRanker.ts` — theme caps and architecture boost
- `lib/hypothesisPrioritization.ts` — hypothesis cap
- `lib/opportunityAggregator.ts` — overlap factor
- `lib/outputCalibration.ts` — post-process storyline/readout
- `lib/storylineSynthesizer.ts` — calibrate on output

## Tone

- Margin opportunity language is **primary**
- Revenue sensitivity is **secondary** and explicitly directional
- Avoid stacked hedge phrases in `lib/executiveNarrative.ts`
- Storyline sections use theme **summaries**, not repeated theme name lists

## When to adjust calibration

Adjust constants when:

- Primary theme count routinely exceeds five after ranking
- Aggregate margin span feels implausibly wide for executive audiences
- Duplicate theme families appear in one readout
- Narrative paragraphs repeat the same theme names

Do **not** adjust calibration to simulate dollar opportunity or optimization outputs.
