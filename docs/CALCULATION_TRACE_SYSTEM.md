# Calculation Trace System (Step 14A)

## Overview

Every thematic opportunity range includes an auditable **`OpportunityCalculationTrace`** exposed in the UI as **“How this was calculated”** (collapsed by default).

## Trace sections

1. **Input signals** — supporting structural signals with strength
2. **Measured values** — computed evidence metrics
3. **Category exposure** — in-scope categories, revenue weights, issue tags, elasticity reference
4. **Weights applied** — calibration band endpoints, exposure multipliers
5. **Elasticity modifier** — sensitivity class and width multiplier (from reference workbooks)
6. **Maturity / confidence modifier** — confidence level, reinforcement, EPR adjustment, combined width
7. **Intermediate steps** — base band → combined multipliers → rounded range → recoverable pool note
8. **Final opportunity range** — low/high % and display string

Nested **Underlying pools** appear for executive themes and portfolio totals.

## Scopes

| Scope | Description |
|-------|-------------|
| `hypothesis` | Single registry hypothesis opportunity pool |
| `executive_theme` | Envelope across supporting hypotheses |
| `portfolio_total` | Overlap-adjusted storyline total |

## Implementation

- `lib/opportunityCalculationTrace.ts` — trace construction
- `lib/opportunityTrace.ts` — public facade
- `components/opportunity/OpportunityCalculationTracePanel.tsx` — expandable UI

## Principles

- Deterministic and explainable
- No hidden black-box scoring
- No raw code or internal debug dumps in default UX
