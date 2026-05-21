# Benchmark Calibration Engine (Step 14B)

## Purpose

Contextualize observed regular-price structure against **directional** McKinsey-style benchmark expectations — improving credibility of opportunity sizing without rigid pass/fail rules.

## Modules

| Module | Role |
|--------|------|
| `lib/benchmarkExpectations.ts` | Archetype/posture reference bands (KVI, premium gap, PL/NB, entry gap) |
| `lib/normativeStructures.ts` | Expected coherent structure by archetype + posture |
| `lib/contextualBenchmarks.ts` | Observed vs expected interpretation phrases |
| `lib/benchmarkCalibration.ts` | Orchestrates bundle, severity, width multiplier, trace rows |
| `lib/structuralThemeMapping.ts` | Maps structural patterns → opportunity themes |
| `data/benchmarkOpportunityBands.ts` | Directional margin bands (mild → transformation) |

## Philosophy

- **Structural coherence** over exact benchmark matching
- **Contextual guides**, not deterministic thresholds
- **Regular-price v1 only** — architecture, KVI, PL/NB, tier spacing, category roles
- **No optimization**, competitor indexing, or automated pricing actions

## Opportunity bands (directional)

| Severity | Margin band (%) | Use |
|----------|-----------------|-----|
| Mild | 0.2–0.5 | Minor inefficiency |
| Moderate | 0.4–1.0 | Architecture / monetization issues |
| Significant | 1.0–2.0 | Material compression |
| Transformation | 1.5–3.0 | Portfolio cap only |

Caps: **1.5%** max single theme, **3.0%** max portfolio indicative total.

## Integration

- Runs inside `runEvidenceComputation` → `ComputedEvidenceBundle.benchmarkCalibration`
- Feeds `calibrateOpportunityTheme` and calculation traces
- Executive summary uses `executiveContextLines` and benchmark-backed drivers

## Reference sources (conceptual)

Informed by uploaded pricing strategy / grocery benchmark / KVI & architecture / IDP materials and Step 14A elasticity references — encoded as **curated directional medians**, not live document parsing.
