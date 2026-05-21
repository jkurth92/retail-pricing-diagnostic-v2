# Opportunity Exposure Engine (Step 14A)

## Purpose

Estimate **which in-scope revenue is structurally exposed** to architecture, PL/NB, and KVI issues — without optimizing prices or prescribing SKU actions.

## Modules

| Module | Role |
|--------|------|
| `lib/opportunityExposure.ts` | Orchestrates exposure bundle, summaries, causal framing |
| `lib/categoryExposure.ts` | Per-category revenue weight, role weight, issue flags, elasticity |
| `lib/recoverableValue.ts` | Deterministic recoverable strategic value pool from bands × modifiers |
| `data/elasticityReference.ts` | Curated medians from uploaded elasticity workbooks |

## Outputs (`OpportunityExposureBundle`)

- Category-level exposure records (revenue %, role weight, elasticity, issue tags)
- Portfolio architecture / PL/NB / KVI affected revenue shares
- Monetizable exposure % (affected revenue weight)
- Exposure and elasticity width multipliers (documented in trace)
- Concise exposure and causal framing lines for executive copy

## Elasticity reference sources

- **Grocery_Elasticities.xlsx** — FOOD L1/L2/L3 weighted elasticities (grocery channel)
- **Department_Store_ELasticity.xlsx** — department/class/category elasticities (department store channel)

Values are **reference medians** mapped to scope category names (Beauty, Grocery, Household essentials, Apparel, etc.).

## Guardrails

- Directional and bounded — not econometric optimization
- No competitor matching or automated pricing actions
- Exposure informs **thematic** opportunity width multipliers only
