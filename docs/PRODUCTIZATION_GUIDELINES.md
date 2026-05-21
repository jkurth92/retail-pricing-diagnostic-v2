# Productization Guidelines

## Information hierarchy

| Priority | Content |
|----------|---------|
| 1 | Retailer pricing profile |
| 2 | Key structural themes |
| 3 | Opportunity overview (margin-led) |
| 4 | Strategic implications |
| 5 | Supporting evidence (signals, patterns, hypotheses) |

## Journey navigation

- Sidebar and stepper reflect the **executive diagnostic journey**, grouped as Setup / Diagnostic readout / Evidence.
- Seven steps replace fragmented technical tabs (uploads, overview, patterns as top-level destinations).

## Language

Replace system-oriented labels with consulting language:

| Avoid | Prefer |
|-------|--------|
| Ontology | Reference definitions |
| Knowledge registry | Archetype & objectives |
| Hypothesis engine preview | Structural themes |
| Signal cluster | Supporting evidence |
| Framework layer | (omit from UI) |

## Opportunity presentation

- Margin opportunity is **primary** and visually dominant.
- Revenue sensitivity is **secondary** prose, not a competing KPI tile.
- No fake precision, calibration UI, or dollar totals unless formulas are aligned.

## Export-ready layout

Sections use `DiagnosticSection` and modular `ExecutiveDeliverablePanel` views (`profile`, `themes`, `opportunity`, `implications`) so future memo/PPT generation can map 1:1 without restructuring the app.

## Still out of scope

- PDF / PowerPoint generation
- Optimization or recommendation UX
- Competitor-matching workflows
- Advanced analytics or scenario tools
