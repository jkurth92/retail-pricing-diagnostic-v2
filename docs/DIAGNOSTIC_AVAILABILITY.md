# Diagnostic Availability

## Purpose

Explain which observed pricing pattern modules can run given **normalized field coverage** — not whether opportunity exists.

## Unlock statuses

| Status | Meaning |
|--------|---------|
| unavailable | Required canonical fields missing |
| limited | Partial coverage; some groups missing |
| available | Minimum field rules met; rules not yet implemented |
| ready | Required + recommended fields present in preview; rules still required |

**Unlock status does not imply opportunity sizing.**

## Minimum field rules (Step 3b)

| Diagnostic | Minimum normalized fields |
|------------|---------------------------|
| KVI patterns | price + category + (revenue OR units) |
| Price architecture | price + packSize + category |
| Price zoning | price + (zone OR store) |
| Promotion patterns | promoFlag OR promoPrice |
| Markdown patterns | markdownFlag OR markdownPrice |

Implemented in [`lib/diagnosticUnlocks.ts`](../lib/diagnosticUnlocks.ts).

## Why a diagnostic may be unavailable

- Required upload file not represented in preview mappings.
- Column failed synonym/fuzzy match (unmapped).
- Field present in one file but not joined into union (future normalization gap).

## Why limited vs available

- **Limited** — Some required groups partially met (e.g. KVI missing units and revenue).
- **Available** — Minimum met; recommended fields may still be missing.

## UI surfaces

- Client Uploads → Diagnostic availability matrix
- Observed Pricing Patterns → per-lever unlock message
- Data Readiness → lever unlock list

## Not active

- Pricing rules and thresholds
- Benchmark comparison
- Findings generation
- Opportunity calculations
