# Benchmark Concepts

## What is a benchmark concept?

A **benchmark concept** names a pricing structure theme (e.g. “ladder integrity”, “KVI breadth”) used to organize future diagnostics. It is **descriptive only** in Step 5B.

## Not a benchmark threshold

Concepts do **not** include:

- Industry cutoffs or “standard” bands
- Good/bad labels
- Opportunity impact
- Active rule evaluation

## Concept families

KVI, Architecture, Zoning, Promotions, Markdown, Governance, ValuePerception, CategoryRoles, ItemRoles.

## Catalog

[`data/benchmarkConcepts.ts`](../data/benchmarkConcepts.ts) — 13 concepts with:

- `supportingEvidence` — upload/context types
- `relatedPatternFeatures` — links to Step 4 feature IDs
- `futureRuleCandidates` — scaffold rule IDs (disabled)

## Future rule candidates

[`data/futureRuleCandidates.ts`](../data/futureRuleCandidates.ts) — statuses:

- `concept_only`
- `pending_alignment`
- `draft_candidate`
- `approved_for_future_build` (still not executed)

## vs rules vs opportunity

| Artifact | Nature |
|----------|--------|
| Benchmark concept | Descriptive theme |
| Pattern feature | Measurable field (value null) |
| Rule (future) | Interpretive logic |
| Opportunity (future) | Financial sizing |
