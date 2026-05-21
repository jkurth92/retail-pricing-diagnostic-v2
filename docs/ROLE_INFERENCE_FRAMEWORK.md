# Role Inference Framework

## Principles

1. **Deterministic** — same inputs produce the same outputs.
2. **Explainable** — rationale templates and confidence templates are visible.
3. **Illustrative** — suggestions are overrideable; not SKU assignments.
4. **Pre-rules** — no good/bad pricing verdicts.

## Inputs

- Retailer archetype (`archetypeId`)
- Pricing posture (`PricingPosture`)
- Strategic objectives (multi-select)
- Optional category hint (e.g. “Laundry detergent”)

## Logic

[`lib/roleInference.ts`](../lib/roleInference.ts) matches category hints against [`data/roleInferenceRules.ts`](../data/roleInferenceRules.ts). When no rule matches, archetype defaults apply.

Example (Mass + laundry):

- Category role: Traffic Driver
- Item mix: 10–15% KVI, 25% Foreground, remainder Background
- Confidence: High when rule + posture align
- Rationale: mass traffic-driver template

## Supporting engines

- [`lib/archetypeContext.ts`](../lib/archetypeContext.ts) — expected structures and concept filtering
- [`lib/rationaleEngine.ts`](../lib/rationaleEngine.ts) — template resolution
- [`lib/confidenceEngine.ts`](../lib/confidenceEngine.ts) — level + explanation

## UI

[`components/RoleInferencePreview.tsx`](../components/RoleInferencePreview.tsx) on Client Context and Observed Pricing Patterns.

## Overrides

Consultants may disagree with inferred roles; the UI states that taxonomy overrides are lightweight and expected. No per-SKU management UI.
