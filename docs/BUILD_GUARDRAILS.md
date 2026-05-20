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

## Engine and rules scaffold (Steps 1–7)

- `lib/diagnostic-engine/` returns pending/null outputs only.
- `data/ruleLibraryPlaceholder.ts` rules are **disabled** — not evaluated.
- `thresholdConfig` and `formulaConfig` must remain `null` until alignment.
- No elasticity, opportunity rates, or AI recommendations in this build.

## Calculations and AI

- When numeric logic is built, keep calculations **transparent and deterministic**.
- AI narrative should **explain** supported outputs — not invent opportunity values.
- User overrides activate only after the engine is implemented.
