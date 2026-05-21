# Evidence Computation Engine (Step 13)

## Why evidence computation is central

Earlier builds inferred structural themes from archetype posture, objectives, and field presence. That produced credible scaffolding but weak ties to uploaded scope. Step 13 computes **measurable structural evidence** first, then lets hypotheses and executive narratives reference those measurements.

The product moves from **framework-driven** toward **evidence-driven** diagnostics.

## Pipeline

1. **Row synthesis** (`lib/pricingRowSynthesis.ts`) — deterministic synthetic price rows from retailer archetype, pricing posture, and inferred category roles (retailer-specific templates, e.g. Target categories).
2. **Signal modules**
   - `lib/architectureSignals.ts` — tier gaps, ladder spacing, PL/NB separation, compression indicators
   - `lib/kviSignals.ts` — KVI revenue/SKU share, category concentration
   - `lib/categorySignals.ts` — revenue concentration, premiumization mix
3. **Orchestration** (`lib/evidenceComputation.ts`) — merges metrics, concise summaries, computed supporting signals, eligible hypothesis IDs
4. **Hypothesis engine** — merges evidence signals with contextual signals; gates registry hypotheses via `isHypothesisEvidenceEligible`
5. **Storyline & executive** — evidence-first summary fields and tightened opportunity framing when evidence strength is high

## Design constraints

- Deterministic and explainable — no black-box AI
- No optimization, exact price recommendations, or competitor matching
- Synthetic rows are a **structural proxy** until canonical CSV parsing is aligned

## Outputs

`ComputedEvidenceBundle` (`types/evidence-computation.ts`) includes:

- `metrics` — labeled measurements
- `summaries` — executive bullet lines (concise, not raw debug tables)
- `computedSignals` — mapped to existing `signalDefinitions` where possible
- `eligibleHypothesisIds` — registry IDs allowed to surface
- `evidenceBackedThemes` — retailer/category-aware narrative lines
