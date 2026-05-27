# Revenue sensitivity logic

## Purpose

The diagnostic estimates **directional margin opportunity** as the primary metric. A separate **revenue sensitivity** band explains how category elasticity and structural patterns might affect sales volume — without forecasting demand.

## What we compute

| Output | Role |
|--------|------|
| Margin range | Primary strategic metric (thematic, non-additive) |
| Revenue sensitivity range | Secondary signed band (e.g. `-0.2% to +0.6%`) |
| Executive label | Scan line (e.g. “Flat to modest upside”) |
| Interpretation | Plain-English implication for leadership |

Implementation: `lib/revenueSensitivityEstimation.ts`.

## How elasticity informs the estimate

1. **Category profiles** — `data/elasticityReference.ts` maps in-scope categories to median |ε| and sensitivity (`low` / `moderate` / `high`).
2. **Portfolio weighting** — `lib/categoryExposure.ts` revenue-weights category elasticity into a portfolio posture.
3. **Exposure bundle** — architecture compression, KVI elevation, and monetizable exposure adjust bounds.
4. **Conservative caps** — revenue span is capped narrower than the linked margin band (typically ≤ ~62% of margin span).

High-elasticity grocery-heavy mixes tighten upside and allow slightly more downside framing. Lower-elasticity / beauty / home contexts support “limited downside” labels.

## What we do not do

- Demand forecasting or econometric simulation  
- Price optimization or elasticity-based “best price”  
- Additive stacking of revenue on margin dollars  
- Presenting revenue as a competing KPI equal to margin  

## Trace

Portfolio margin trace (`marginOpportunityTotalTrace`) includes `revenueSensitivity` with category elasticity rows, modifiers, and steps — visible under **Consultant detail**.

## Wording

Prefer: *potential revenue impact*, *directional sales sensitivity*, *limited expected volume downside*.  
Avoid: *forecast*, *prediction*, *expected revenue gain*.
