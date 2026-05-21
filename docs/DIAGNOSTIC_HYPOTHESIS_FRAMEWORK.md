# Diagnostic Hypothesis Framework

## Purpose (Step 6A)

The hypothesis engine is the **first reasoning layer**: it interprets structural pricing patterns into 3–5 prioritized themes with rationale, confidence, and bounded opportunity pools.

It is **not** a recommendation or optimization system.

## Structural coherence philosophy

- Think in **themes**, not isolated metrics
- Require **multiple reinforcing signals** before surfacing a hypothesis
- **Prioritize architecture** families in ranking
- **Suppress** low-confidence noisy themes

## Pipeline

```text
Knowledge context + role inference + pattern readiness
  → signalGrouping (evaluateStructuralSignals)
  → match hypothesis registry (min signals)
  → confidenceScoring
  → narrativeGenerator
  → opportunityCalibration
  → hypothesisPrioritization (max 5)
```

## Key modules

| Module | Path |
|--------|------|
| Engine | `lib/hypothesisEngine.ts` |
| Signals | `lib/signalGrouping.ts` |
| Confidence | `lib/confidenceScoring.ts` |
| Calibration | `lib/opportunityCalibration.ts` |
| Narrative | `lib/narrativeGenerator.ts` |
| Registry | `data/diagnosticHypotheses.ts` |

## Disabled

- Exact pricing actions
- Benchmark thresholds
- Dollar opportunity totals
- AI / black-box reasoning
