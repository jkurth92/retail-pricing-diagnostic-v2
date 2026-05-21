# Next Steps

## Immediate decision point

**Review and sign off** the canonical upload schema (`docs/UPLOAD_SCHEMA.md`) and readiness model (`docs/DATA_READINESS.md`), then implement **file ingestion and normalization** — still no opportunity math or active rules.

## Roadmap

### Step 3 — Upload schema and data readiness (complete)

- Canonical schema v1.0.0 in `types/upload-schema.ts` and `data/uploadFieldCatalog.ts`
- Readiness states and scoring structure in `types/data-readiness.ts`
- Diagnostic availability matrix in `data/diagnosticAvailabilityMatrix.ts`
- Placeholder UI on Client Uploads tab

### Step 3b — Upload ingestion scaffolding (complete)

- Deterministic column matcher, readiness evaluator, diagnostic unlocks
- Placeholder ingestion preview in Client Uploads UI
- No file parsing, storage, or persistence

### Step 3c — Real file ingestion (next)

- Client-side or server-side parse to detected columns only
- Persist mappings per session (not in Git)
- Row-level normalization into `NormalizedPricingRecord`

### Step 4 — Observed pricing pattern features (complete)

- Pattern feature catalog per lever in `data/patternFeatureCatalog.ts`
- Deterministic builders in `lib/patternFeatureBuilder.ts` and `lib/patternEvidence.ts`
- Observed Pricing Patterns UI shows feature inventory (no values, no findings)

### Step 4b — Feature computation (next)

- Compute feature values from normalized rows after live ingestion
- Map computed features to evidence items in `DiagnosticRunOutput`

### Step 7 — Executive deliverable & storyline system (complete)

- Executive summary, retailer profile, seven-section storyline, opportunity overview, strategic implications
- `runExecutiveDeliverableEngine()` and export scaffold (`scaffold_only`)
- Overview tab and Opportunity Size show narrative readout
- PDF/PPT/memo generation not implemented

### Step 6B — Opportunity & storyline engine (complete)

- Synthesizes hypotheses into executive themes and consulting narrative
- Margin-led aggregated opportunity framing with overlap adjustment
- UI on Client Context, Observed Patterns, Opportunity Size

### Step 7 — Rule activation & dollar sizing (next)

- Align thresholds; translate thematic ranges to scope dollars when approved
- Connect computed pattern values to signal strength

### Step 6A — Diagnostic hypothesis engine (complete)

- Deterministic signal grouping, confidence, narrative, opportunity calibration
- Surfaces 3–5 prioritized structural hypotheses in UI
- Thematic margin pools — no dollar opportunity or recommendations

### Step 6B — Rule activation (next)

- Align thresholds per hypothesis family
- Connect pattern feature values when computed
- Move selected hypotheses from thematic to rule-backed findings

### Step 5B — Pricing knowledge registry (complete)

- Ontology types, data catalogs, deterministic role inference
- Knowledge Registry UI on Client Context; context on Observed Pricing Patterns
- Benchmark concepts and future rule candidates (scaffold only)

### Step 5 — Knowledge source review (next)

- Review local knowledge documents (not in Git)
- Produce approved concept manifest aligned to `data/benchmarkConcepts.ts`
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
