# Opportunity Aggregation

## Margin primary

Each executive theme carries a **thematic margin band** derived from its supporting hypotheses’ calibrated pools.

Total margin range uses:

- Per-theme low/high bounds parsed from hypothesis opportunity themes
- **Overlap factor 0.52** — themes are not independent initiatives
- **Cap ~2.8%** high — avoids fake precision and over-wide totals
- Architecture themes anchor the high end of the combined range

## Revenue secondary

`buildRevenueSensitivitySummary` uses:

- Highest elasticity sensitivity among supporting hypotheses
- Archetype context sentence
- Per-theme revenue sensitivity notes

Category elasticity is a **modifier for framing only** — not an optimizer.

## Drivers

- **Primary:** surfaced executive themes (medium+ confidence)
- **Secondary:** next-ranked themes
- **Enabler:** governance theme when not already primary

## Status

- `thematic_only` — default
- `pending_scope_dollars` — revenue in scope captured, dollars not translated
- `insufficient_hypotheses` — no primary themes
