# Strategic Implications

## What this layer does

The strategic implications engine (`lib/strategicImplications.ts`) translates surfaced themes into **interpretive statements** — what the observed pricing structure likely means for trade-up, visible value concentration, promo integrity, and governance capture.

Examples (from `data/strategicImplicationTemplates.ts`):

- Current pricing structure may limit effective trade-up monetization.
- Visible value investment appears broadly distributed rather than strategically concentrated.
- Architecture coherence may not fully support stated premiumization objectives.

## What it does not do

- Recommend exact price changes, promo depths, or SKU actions  
- Optimize prices or run elasticity-based “best price” logic  
- Produce competitor-matched price targets  
- Invent dollar precision  

Implications are **diagnostic**, not **prescriptive**.

## How themes feed implications

1. **Template matching** — each `ExecutiveThemeFamily` maps to one or more template lines.  
2. **Hypothesis architecture notes** — `architectureImplications` from supporting hypotheses add architecture-specific lines (deduplicated).  
3. **Maturity fragment** — confidence summary text selects a maturity-aware closing line from `MATURITY_IMPLICATION_FRAGMENTS`.

Premiumization objectives in the retailer profile can add an extra line when objectives mention premiumization.

## Architecture-first bias

Architecture and premiumization templates are evaluated first because they frame whether KVI, promo, and markdown themes are symptoms or root structural issues.

## Margin vs revenue in implications

Implications describe **structure and capture**, not revenue forecasts. Revenue sensitivity stays in storyline and opportunity overview as a **secondary, directional** modifier.
