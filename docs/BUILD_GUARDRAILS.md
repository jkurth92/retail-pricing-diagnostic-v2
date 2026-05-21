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

## End-to-end validation & calibration (Step 10)

- Validate **end-to-end coherence** before adding new product features.
- **Manual override precedence** must remain verifiable (`lib/contextSanityChecks.ts`).
- **Client data** (uploads, knowledge selections) remains the core diagnostic source of truth.
- **API enrichment is context-only** — never hypothesis, opportunity, or storyline inputs.
- **Suppress clutter and redundancy** in default UI (no duplicate storyline widgets).
- **Opportunity ranges** must stay bounded, overlap-adjusted, and non-prescriptive.
- **Architecture-first prioritization** preserved in ranking and storyline order.
- Use `tests/e2e/*` scenarios and **Validation review** step before release polish.
- Calibration constants live in `data/outputCalibrationRules.ts` — tune presentation only.

## Retailer context API enrichment (Step 9)

- External APIs **only enrich retailer context** (profile, news, overview) — never core diagnostics.
- **Never use APIs** as inputs to hypothesis, opportunity, storyline, or rule engines.
- **Manual override takes precedence** over API and curated reference data.
- **No competitor scraping** or API-based competitor matching.
- **No pricing rules, optimization, or opportunity sizing** derived from API context.
- App must **function fully without API availability** (aliases + manual input + curated fallback).
- Enrichment mapping must stay **deterministic and explainable** (documented sources in UI).
- Executive narrative may **phrase** scale/sector/news context; it must **not change diagnostic math**.
- API keys only in server routes; never commit `.env` or secrets.

## UX & productization (Step 8)

- **Narrative-first UX** — conclusions and executive narratives before supporting diagnostics.
- **Progressive disclosure required** — signals, rationale, maturity scoring, ingestion detail, and reference material behind expandable sections.
- **Avoid framework-heavy UI** — no ontology explorers, layer progress strips, or implementation terminology in default views.
- **Avoid dashboard clutter** — restrained cards, fewer status pills, no duplicate storyline blocks per step.
- **Executive readability prioritized** — spacious sections, clear hierarchy, consulting-style copy.
- **Primary insights before supporting diagnostics** — journey steps 3–6 are readout; step 7 is evidence-only.
- **Do not expose implementation mechanics** unnecessarily (engine version, scaffold labels, step IDs) in client-facing copy.
- Primary module tabs (pricing / promotions / markdown) remain **out of default navigation** until aligned.

## Executive deliverable (Step 7)

- Executive outputs must remain **explainable** — themes, hypotheses, signals, and section narratives traceable to prior engine steps.
- **No tactical pricing prescriptions** in executive summary, storyline sections, or implications.
- **No fake precision** — thematic margin bands and overlap-adjusted totals only; no implied dollar certainty.
- **No optimization behavior** — deliverable is diagnostic readout, not price-setting software.
- Storyline sequencing must stay **architecture-first** per `data/executiveStorylineFlow.ts`.
- Outputs must prioritize **coherence over metric volume** — bounded ranges, not KPI dashboards.
- **Suppress disconnected low-confidence observations** — empty storyline sections omitted; themes already filtered in 6A/6B.
- Margin opportunity is **primary**; revenue sensitivity is **secondary and directional** only.
- Strategic implications are interpretive **“what this means”** lines — not action plans.

## Opportunity exposure & calculation trace (Step 14A)

- **Opportunity ranges must be traceable** — every thematic range includes an auditable “How this was calculated” path.
- **All surfaced themes require measurable evidence** — exposure weighting uses category-level issue tags, not generic narratives.
- **Opportunity logic must remain auditable** — deterministic modifiers (confidence, exposure, elasticity) documented in trace; no black-box scoring.
- **Elasticity is contextual only** — reference workbooks modify thematic band width and framing; not SKU optimization or price prescriptions.
- **Suppress unsupported opportunity claims** — weak evidence widens or suppresses themes; no fake precision.
- **Calculation traces are secondary UX** — expandable panels only; executive summary stays concise.
- **Category-weighted exposure** — revenue and role weights differ by category; not equal treatment.
- **No optimization engines, competitor matching, or automated pricing actions.**

## Evidence computation & signal generation (Step 13)

- **Evidence computation is central** — measurable architecture, KVI, and category signals must precede theme surfacing.
- **Hypotheses must be evidence-backed** — registry themes without supporting computed signals are suppressed (no generic “architecture compression” without tier/PL-NB evidence).
- **Avoid generic unsupported narratives** — framework-only signals must not fire when measured evidence does not reinforce them.
- **Suppress weak themes** — prefer fewer, stronger evidence-backed themes over many low-confidence generic themes.
- **Executive summaries must remain concise** — answer-first headline, 2–3 evidence-backed themes, supporting metric bullets, one strategic implication sentence.
- **Feature / pattern inventory panels remain secondary** — technical detail behind disclosure; not default executive UX.
- **Prioritize measurable signals** over framework language and consulting filler.
- **Architecture, KVI, and PL/NB dominate** — promo and markdown themes surface only when upload evidence includes promo/markdown fields.
- **No optimization, exact recommendations, competitor matching, or black-box AI** in the evidence path.
- Synthetic row generation is **deterministic and explainable** until real CSV parsing is aligned — document as structural proxy, not benchmark truth.

## Pilot workflow simplification (Step 12)

- **Guided workflow prioritized** — five visible steps; internal architecture not in default navigation.
- **Hide internal complexity** — ontology, registry, calibration, and validation are secondary or disclosed only.
- **Narrative-first UX** — summary and themes before evidence and mechanics.
- **Uploads feel intelligent and lightweight** — unified 1–2 file intake; no default file-type taxonomy.
- Users must **not configure frameworks manually** in the default path — assumptions are optional disclosures.
- **Framework mechanics remain secondary** — progressive disclosure required for evidence and reference material.
- Diagnostic flow stays **simple and executive-oriented** — explicit “Generate pricing diagnostic” gate before readout.
- **No new intelligence** in this step — UX and workflow only; engines unchanged.

## Executive export system (Step 11)

- Exports must remain **editable** (DOCX, PPTX, copyable email) — not locked or image-only deliverables.
- Outputs are **narrative-first consulting first drafts** — not analytics reports or dashboard exports.
- **Answer-first structure required** — memo executive answer and slide 1 opportunity headline lead.
- **Architecture-first prioritization** — architecture deep dive is the default anchor slide.
- **Avoid dashboard-style slides** and excessive analytics density (no chart packs in default deck).
- **No operational recommendations** or exact price prescriptions in export copy.
- **No fake precision** — directional margin bands only; no implied dollar certainty from exports.
- Deliverables should resemble **consulting draft deliverables** (partner email, 1-page memo, sparse deck).
- PDF export remains **disabled** until explicitly aligned; DOCX is the preferred document format.
- PPTX must use `templates/Template.pptx` as layout basis when present; remain LOP-editable.
- Storyline export must preserve **headline → implication → evidence → opportunity → confidence** hierarchy.
- Modularity (`ExportSection`, `ExportSectionSelection`) must not lock consultants into static layouts.

## Calculations and AI

- When numeric logic is built, keep calculations **transparent and deterministic**.
- AI narrative should **explain** supported outputs — not invent opportunity values.
- User overrides activate only after the engine is implemented.
