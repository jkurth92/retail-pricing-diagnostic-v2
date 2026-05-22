# Graceful degradation (Step 15)

## Purpose

Preserve **directional** strategic outputs when data is imperfect — avoid hard “no estimate” outcomes when partial evidence exists.

## Module

`lib/gracefulDegradation.ts`

## Behaviors

1. **Weighted sufficiency** — overall score ≥ 0.28 allows directional opportunity
2. **Fallback ranges** — archetype-typical bands when no themes are prioritized
3. **Range widening** — multiplier up to ~1.18 when sufficiency is low
4. **Theme eligibility** — medium-confidence themes can rank when sufficiency supports directional read
5. **Hypothesis suppression** — only when confidence is low **and** sufficiency &lt; 0.22

## Preferred messaging

> Moderate directional opportunity identified, though evidence quality is constrained by incomplete architecture normalization.

Not:

> Not estimated — insufficient prioritized themes

(unless sufficiency is truly too weak)
