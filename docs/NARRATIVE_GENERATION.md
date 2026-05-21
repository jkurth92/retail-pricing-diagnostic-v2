# Narrative Generation

## Style

Consulting-style, assertive but not overconfident. Explains **why structure matters**, not benchmark verdicts.

**Good:** “Observed pricing structure may indicate broad value investment compressing monetization architecture…”

**Bad:** “Premium gaps below benchmark.”

## Implementation

- Fragments: `data/hypothesisRationaleFragments.ts`
- Composer: `lib/narrativeGenerator.ts`

Each hypothesis registry entry has a `narrativeKey` mapping to lead / connective / implication sentences, plus optional signal name list.

## Rules

- Connect multiple reinforcing signals
- No exact price prescriptions
- No fake statistical precision
- No AI generation
