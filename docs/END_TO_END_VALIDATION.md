# End-to-End Validation

## Purpose

Step 10 validates that retailer enrichment, client context, role inference, hypotheses, opportunity framing, executive storyline, and UI presentation work together **coherently and credibly** — without adding new diagnostic logic families.

## Validation scaffold

| Asset | Role |
|-------|------|
| `tests/e2e/retailer-scenarios.ts` | Seven representative retailer setups |
| `tests/e2e/validationScenarios.ts` | Per-scenario flow expectations |
| `lib/validationHarness.ts` | Runs full engine stack for a scenario |
| `lib/endToEndValidator.ts` | Aggregates flags into pass/fail |
| `lib/diagnosticConsistencyChecker.ts` | Theme, hypothesis, readout checks |
| `lib/contextSanityChecks.ts` | API vs manual override checks |

## Flow checkpoints

1. Retailer context / overview (enrichment fallback)
2. Client context inputs
3. Scope / readiness (placeholder ingestion)
4. Role inference (via knowledge registry)
5. Hypothesis generation (max 5 surfaced)
6. Opportunity framing (margin primary)
7. Executive storyline (section order)
8. Manual override precedence
9. API fallback (no workflow block)

## UI review mode

Workflow step **Validation review** runs the harness in-browser and shows flags, summaries, and optional **Apply scenario to app** for manual walkthrough.

## Running checks

Validation runs deterministically in the client via `runValidationScenario(id)`. No separate test runner is required for this POC; scenarios are TypeScript modules imported by the harness.

## Pass criteria

- Zero `error` severity flags
- At most three `warning` flags (tunable)
- Executive profile and primary themes present
- Manual override sanity check passes
