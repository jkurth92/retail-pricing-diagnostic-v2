# Build Guardrails

## Rules and benchmarks

- **Do not** implement benchmark rules, thresholds, or scoring logic without explicit alignment.
- **Do not** invent pricing thresholds or industry “standard” cutoffs.
- **Do not** hardcode proprietary consulting IP, frameworks, or benchmark packs.
- Rules from knowledge documents require explicit review per [`KNOWLEDGE_SOURCE_PLAN.md`](KNOWLEDGE_SOURCE_PLAN.md).

## Integrations and data

- **Do not** add external APIs (retailer data, news, financials) without approval.
- **Do not** parse client uploads until the canonical upload schema is aligned.
- **Do not** commit secrets, `.env` files, client uploads, or proprietary documents.
- Raw client or proprietary documents must not be committed (`client_uploads/`, `knowledge/raw/`, etc.).

## Competitors and scope

- Competitor suggestions are **for retailer overview context only** until validated.
- Local seed suggestions are not externally validated and must be labeled in the UI.
- Competitors must **not** affect opportunity sizing.
- Scope math may calculate denominator values (addressable revenue = total × %) but **must not** calculate opportunity.

## Opportunity & storyline engine (Step 6B)

- Storyline must remain **explainable** with visible themes, hypotheses, and signals.
- **No recommendation language** or exact pricing prescriptions in narrative output.
- **No exact optimization outputs** or dollar precision without aligned formulas.
- **No competitor dependence** in storyline synthesis.
- **No fake precision** — overlap-adjusted thematic margin totals only.
- **Max 3–5 primary themes**; secondary themes capped at 2.
- **Architecture-first prioritization** in ranking and narrative emphasis.
- **Suppress low-confidence** themes from primary storyline.
- Revenue sensitivity is **secondary** to margin opportunity.

## Diagnostic hypothesis engine (Step 6A)

- Hypotheses must remain **explainable** with visible supporting signals and rationale.
- **No black-box reasoning** or generative AI conclusions.
- **No exact pricing prescriptions** or SKU-level actions in hypothesis output.
- **No fake precision** — thematic margin bands only, not dollar totals.
- **No hard thresholds** without explicit alignment workshops.
- **Architecture themes prioritized** over isolated metric anomalies.
- **Suppress noisy low-confidence** findings (max 5 surfaced).
- Elasticity is an **interpretation modifier** only — not optimization logic.
- Opportunity themes are **bounded pools**, not optimized recommendations.

## Knowledge registry (Step 5B)

- Inference must remain **explainable** — rationale and confidence templates visible in UI.
- **No hidden AI pricing logic** or generative conclusions.
- Benchmark concepts are **descriptive only** — no thresholds in concept definitions.
- **No active thresholds** without explicit alignment workshops.
- **No opportunity sizing** during the ontology stage.
- Category/item role overrides must stay **lightweight** — no SKU-by-SKU management assumptions.
- Future rule candidates are scaffold records only — not executed by the engine.

## Pattern features (Step 4)

- Pattern features must **not** imply pricing conclusions or recommendations.
- Feature definitions must remain **deterministic** and documented in `calculationNote`.
- **No benchmark thresholds** in feature definitions or examples.
- **No opportunity math** in pattern features or observed patterns UI.
- **No recommendation language** in the observed patterns layer.
- “Visibility proxy” and similar names are descriptive only — not competitive scores.

## Ingestion and normalization (Step 3b)

- Column matching does **not** imply benchmark interpretation or competitive conclusions.
- `columnMatcher`, `readinessEvaluator`, and `diagnosticUnlocks` must remain **deterministic** and explainable.
- Readiness percentages describe **coverage only** — not opportunity or pricing performance.
- Diagnostic unlock states (`unavailable` / `limited` / `available` / `ready`) must **not** imply opportunity sizing.
- No pricing logic, thresholds, or recommendations until explicit rule alignment.

## Engine and rules scaffold (Steps 1–7)

- `lib/diagnostic-engine/` returns pending/null outputs only.
- `data/ruleLibraryPlaceholder.ts` rules are **disabled** — not evaluated.
- `thresholdConfig` and `formulaConfig` must remain `null` until alignment.
- No elasticity, opportunity rates, or AI recommendations in this build.

## Executive deliverable (Step 7)

- Executive outputs must remain **explainable** — themes, hypotheses, signals, and section narratives traceable to prior engine steps.
- **No tactical pricing prescriptions** in executive summary, storyline sections, or implications.
- **No fake precision** — thematic margin bands and overlap-adjusted totals only; no implied dollar certainty.
- **No optimization behavior** — deliverable is diagnostic readout, not price-setting software.
- Storyline sequencing must stay **architecture-first** per `data/executiveStorylineFlow.ts`.
- Outputs must prioritize **coherence over metric volume** — bounded ranges, not KPI dashboards.
- **Suppress disconnected low-confidence observations** — empty storyline sections omitted; themes already filtered in 6A/6B.
- Margin opportunity is **primary**; revenue sensitivity is **secondary and directional** only.
- Export (`lib/exportScaffold.ts`) is **scaffold only** — no PDF/PPT generation until aligned.
- Strategic implications are interpretive **“what this means”** lines — not action plans.

## Calculations and AI

- When numeric logic is built, keep calculations **transparent and deterministic**.
- AI narrative should **explain** supported outputs — not invent opportunity values.
- User overrides activate only after the engine is implemented.
