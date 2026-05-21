# Opportunity & Storyline Engine (Step 6B)

## Purpose

Synthesizes Step 6A diagnostic hypotheses into an **executive storyline** with:

- 3–5 primary executive themes
- Optional secondary themes
- Aggregated thematic margin range (non-additive)
- Secondary revenue sensitivity framing
- Consulting narrative

## Pipeline

```text
DiagnosticHypothesisOutput
  → group by executive theme definitions
  → rank (architecture-first, confidence filter)
  → aggregate opportunity (overlap factor)
  → executive narrative
  → StorylineSummary + OpportunitySummary
```

## Modules

| Module | Role |
|--------|------|
| `lib/storylineSynthesizer.ts` | Orchestrator `runOpportunityStorylineEngine` |
| `lib/themeRanker.ts` | Primary/secondary cap, confidence bar |
| `lib/opportunityAggregator.ts` | Margin + revenue sensitivity aggregation |
| `lib/executiveNarrative.ts` | Summary and storyline prose |
| `lib/opportunitySummary.ts` | OpportunitySummary object |

## Disabled

- Dollar sizing, optimization, recommendations, competitors, thresholds
