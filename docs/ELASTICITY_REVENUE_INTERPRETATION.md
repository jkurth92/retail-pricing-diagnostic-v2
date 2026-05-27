# Elasticity → revenue interpretation

## Why elasticity is in the product

Uploaded workbook references (grocery and department-store channels) provide **curated median elasticities** by category. These inform **interpretation**, not live econometric fitting.

## Mapping flow

```
Scope categories
  → resolveCategoryElasticity()     [data/elasticityReference.ts]
  → absElasticityToSensitivity()    [low | moderate | high]
  → category exposure records       [lib/categoryExposure.ts]
  → portfolio elasticity + width multiplier
  → revenue sensitivity bounds      [lib/revenueSensitivityEstimation.ts]
```

`elasticityWidthMultiplier` still applies to **thematic margin band width** in exposure weighting (`docs/EXPOSURE_WEIGHTING.md`). Revenue sensitivity uses the same category signals for **directional bounds**, not SKU-level math.

## Category examples (directional)

| Context | Typical framing |
|---------|-----------------|
| High-elasticity grocery | Tighter revenue upside; trip/perception sensitivity noted |
| Beauty / home (lower ε) | Modest upside with limited downside in label |
| Architecture-led opportunity | “Margin-accretive with limited sales disruption” |
| KVI-heavy exposure | Upside capped; value-visible categories drive caution |

## Margin vs revenue

- **Margin** — structural capture from ladder, PL/NB, KVI, and architecture themes (primary).  
- **Revenue** — how volume might respond if price roles change (secondary, signed % band + label).

They are **related** (revenue anchors to margin midpoint) but **not additive** and not the same unit of analysis.

## Executive layer

Hero shows margin first, then **Potential revenue impact** with label + signed range. Executive summary adds one plain-English sentence from `revenueSensitivitySummary` — no technical ε language.

## Consultant layer

Trace panel section **Directional revenue sensitivity** lists:

- Category elasticity inputs (category, sensitivity, reference source)  
- Modifiers (architecture-led, KVI, portfolio elasticity, conservative cap)  
- Calculation steps (anchor → elasticity → modifiers → cap)  

## Guardrails

Revenue output is always labeled **directional** and **not a volume forecast**. Confidence and evidence strength can narrow the band but cannot invent unsupported upside.
