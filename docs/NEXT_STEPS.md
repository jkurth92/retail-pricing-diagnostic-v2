# Next Steps

## Immediate decision point

**Approve the canonical upload schema** before any parsing, readiness scoring, or pattern generation. Until then, all engine and rule outputs remain `pending_alignment`.

## Roadmap

### Step 3 — Upload schema and data readiness (next)

- Finalize required / recommended / optional fields per upload type
- Define readiness scoring and diagnostics availability rules
- Implement parse validators (still no opportunity math)

### Step 4 — Observed pricing pattern features

- Align feature definitions per lever (KVI, architecture, zoning, promotions, markdown)
- Map features to evidence items in `DiagnosticRunOutput`

### Step 5 — Knowledge source review

- Review local knowledge documents (not in Git)
- Produce approved concept manifest
- Link concepts to disabled rule slots in `data/ruleLibraryPlaceholder.ts`

### Step 6 — First diagnostic rules

- Align thresholds and POV references per rule
- Change individual rules from `disabled` to `approved_not_implemented` then implement

### Step 7 — Deterministic engine

- Enable `runDiagnosticEngine` stages incrementally
- Opportunity formulas and confidence scoring signed off separately

## References

- [`OUTPUT_CONTRACT.md`](OUTPUT_CONTRACT.md)
- [`KNOWLEDGE_SOURCE_PLAN.md`](KNOWLEDGE_SOURCE_PLAN.md)
- [`BUILD_GUARDRAILS.md`](BUILD_GUARDRAILS.md)
