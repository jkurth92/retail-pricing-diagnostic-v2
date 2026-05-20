# Observed Pricing Patterns Layer

## Position in the stack

```text
Normalized uploads → Pattern features (Step 4) → Rules (future) → Opportunity (future)
```

The **Observed Pricing Patterns** workflow tab shows the feature inventory per lever — not conclusions.

## UI behavior (Step 4)

For each lever, the page displays:

- Feature count and section status
- Required canonical fields (union across features)
- Missing inputs from ingestion preview
- Per-feature calculation notes and examples
- Unlock message from diagnostic availability (field coverage)
- Explicit “findings not generated” / “opportunity not calculated”

## Relationship to diagnostic unlocks

Diagnostic unlocks (Step 3b) answer: “Do we have enough normalized fields?”

Pattern features answer: “What would we measure if we did?”

A lever can show features as **pending_alignment** while unlock status is **available** — rules still block execution.

## What users should not expect

- Good/bad pricing labels
- Competitive benchmark verdicts
- Dollar or bps opportunity
- AI-generated narratives
- Active rule evaluation

See [`PATTERN_FEATURES.md`](PATTERN_FEATURES.md) and [`DIAGNOSTIC_AVAILABILITY.md`](DIAGNOSTIC_AVAILABILITY.md).
