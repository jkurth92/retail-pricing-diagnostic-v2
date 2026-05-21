# Confidence Scoring

## Levels

`low` | `medium` | `medium_high` | `high`

## Deterministic inputs

- Count and strength of supporting signals
- Conflicting signals (penalty)
- Role inference confidence (high / medium / low)
- Pattern feature evidence coverage ratio
- EPR maturity average (optional modifier)

## Increase confidence when

- Multiple reinforcing signals (especially strong)
- Architecture evidence adequate
- Category role inference is high
- Coherent maturity context

## Reduce confidence when

- Sparse pattern field coverage
- Conflicting signals present
- Weak role inference
- Low EPR maturity

## Suppression

Hypotheses with `low` confidence are marked `suppressed_low_confidence` and excluded from the top 5 surfaced themes.

Implementation: `lib/confidenceScoring.ts`
