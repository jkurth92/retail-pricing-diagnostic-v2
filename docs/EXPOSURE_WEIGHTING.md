# Exposure Weighting (Step 14A)

## Category weighting

Each in-scope category receives:

- **Revenue weight %** — from synthesized pricing row revenue weights
- **Role weight** — traffic driver / premiumization / profit driver emphasis
- **Issue tags** — `tier_compression`, `narrow_pl_nb`, `kvi_concentration` from measured structure
- **Elasticity profile** — mapped from `data/elasticityReference.ts`

Categories are **not treated equally**: architecture and KVI themes only count categories with matching issue flags when computing theme exposure %.

## Opportunity width formula (hypothesis level)

```
adjustedRange = baseBand × confidenceWidth × exposureWidth × elasticityWidth
```

| Modifier | Source |
|----------|--------|
| `confidenceWidth` | Confidence level + evidence strength |
| `exposureWidth` | Monetizable in-scope revenue exposure (0.88–1.05 scale) |
| `elasticityWidth` | Category-weighted elasticity sensitivity (0.90–1.02 scale) |

Elasticity modifies **thematic band width** contextually — not SKU-level price optimization.

## Portfolio total

Theme bands are summed with **overlap factor** (0.52), floor/cap, and architecture ceiling — unchanged from Step 6B; trace documents each step.

## Confidence behavior

- Strong evidence + high exposure → tighter combined multipliers (via evidence strength factor)
- Weak evidence → wider multipliers; hypotheses may still be suppressed at low confidence

## Recoverable value

`lib/recoverableValue.ts` labels output as **recoverable strategic value pools** — directional margin themes tied to exposed revenue, not optimized price changes.
