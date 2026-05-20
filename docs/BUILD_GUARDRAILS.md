# Build Guardrails

## Rules and benchmarks

- **Do not** implement benchmark rules, thresholds, or scoring logic without explicit alignment.
- **Do not** invent pricing thresholds or industry “standard” cutoffs.
- **Do not** hardcode McKinsey or other proprietary consulting IP, frameworks, or benchmark packs.

## Integrations and data

- **Do not** add external APIs (retailer data, news, financials) without approval.
- **Do not** parse client uploads (CSV, Excel, PDF) until the canonical upload schema is aligned.
- **Do not** commit secrets, `.env` files, or client data to the repository.

## Calculations and AI

- When numeric logic is built, keep calculations **transparent and deterministic** (document inputs, formulas, and outputs).
- AI narrative should **explain** outputs supported by data and rules — not create unsupported numbers or opportunity estimates.
- User overrides must remain possible for recommendations and assumptions.

## Step 1 reminder

Placeholder copy should read **“Requires alignment before implementation.”** where business logic is deferred.
