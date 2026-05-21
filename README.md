# Retail Pricing Diagnostic (v2)

Agentic retail pricing diagnostic application — Steps 1–7 UI and scaffolding (no active pricing logic).

## Product purpose

This app supports a consulting-style pricing diagnostic workflow:

1. Client context and uploads
2. Observed pricing pattern analysis
3. Benchmark interpretation
4. Opportunity sizing
5. Explainable recommendations and memo generation

Step 1 delivered the professional UI shell and project foundation.

Steps 2–7 add the output contract, six-step workflow, scope controls, competitor suggestions, observed-pattern placeholders, and a disabled rule/engine scaffold.

**Step 3** aligns the canonical upload schema (`NormalizedPricingRecord`), field catalog, readiness states, and descriptive scoring model — parsing not active.

**Step 4** defines the observed pricing pattern feature catalog (27 features across 5 levers) — measurements only, no rule interpretation or opportunity math.

**Step 5B** implements the pricing knowledge registry (archetypes, roles, benchmark concepts, deterministic inference) — pre-rules, pre-opportunity.

**Step 6A** implements the diagnostic hypothesis engine (structural themes, confidence, bounded opportunity pools) — first reasoning layer, not recommendations.

## Current scope (Step 1)

- Next.js App Router with TypeScript and Tailwind CSS
- Consulting-style layout: sidebar, header summary, module tabs, workflow tabs
- Client Context screen with retailer input, EPR scoring (UI state), strategic context, upload placeholders
- Placeholder screens: Scope of Diagnostic, Retailer Overview, Opportunity Size
- UI-only types and transparent EPR average display
- Product and build guardrail documentation

## Workflow (Steps 1–7)

1. Client Context — retailer, EPR, strategic context, competitor suggestions
2. Client Uploads — upload placeholders + data readiness model
3. Retailer Overview — financial / peer / insights / news placeholders
4. Scope of Diagnostic — denominator math only
5. Observed Pricing Patterns — evidence placeholders per lever
6. Opportunity Size — null opportunity output + engine scaffold panel

## Scaffolding added

- Output contract: `types/diagnostic-output.ts`, `scope.ts`, `competitors.ts`, `data-readiness.ts`, `rules.ts`
- Placeholders: `data/placeholderDiagnosticOutput.ts`, `uploadReadinessPlaceholders.ts`, `ruleLibraryPlaceholder.ts`
- Engine: `lib/diagnostic-engine/` (returns pending / null)
- Rules: `lib/rules/ruleLibrary.ts` (all rules disabled)

## Intentionally not implemented yet

- Database and authentication
- External APIs and retailer data fetch
- File upload backend and parsing (CSV, PDF, etc.)
- Benchmark rules, pricing thresholds, and consulting IP
- Walmart or strict SKU-to-retailer matching
- Elasticity, KVI, zoning, architecture, promotion, or markdown rules
- Opportunity sizing formulas and confidence scoring
- AI-generated recommendations or unsupported numeric outputs

## Run locally

```bash
cd retail-pricing-diagnostic-v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run lint
npm run build
```

## GitHub sync

Target repository: **retail-pricing-diagnostic-v2** (private).

If GitHub CLI is installed:

```bash
gh auth login
gh repo create retail-pricing-diagnostic-v2 --private --source=. --remote=origin --push
```

Without `gh`, create the repo on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/retail-pricing-diagnostic-v2.git
git push -u origin main
```

Do not commit `.env` files or secrets.

## Documentation

- [docs/PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md)
- [docs/OUTPUT_CONTRACT.md](docs/OUTPUT_CONTRACT.md)
- [docs/UPLOAD_SCHEMA.md](docs/UPLOAD_SCHEMA.md)
- [docs/DATA_READINESS.md](docs/DATA_READINESS.md)
- [docs/NORMALIZATION_FLOW.md](docs/NORMALIZATION_FLOW.md)
- [docs/UPLOAD_MAPPING.md](docs/UPLOAD_MAPPING.md)
- [docs/DIAGNOSTIC_AVAILABILITY.md](docs/DIAGNOSTIC_AVAILABILITY.md)
- [docs/PATTERN_FEATURES.md](docs/PATTERN_FEATURES.md)
- [docs/OBSERVED_PRICING_PATTERNS.md](docs/OBSERVED_PRICING_PATTERNS.md)
- [docs/PRICING_KNOWLEDGE_ONTOLOGY.md](docs/PRICING_KNOWLEDGE_ONTOLOGY.md)
- [docs/ROLE_INFERENCE_FRAMEWORK.md](docs/ROLE_INFERENCE_FRAMEWORK.md)
- [docs/BENCHMARK_CONCEPTS.md](docs/BENCHMARK_CONCEPTS.md)
- [docs/INTERPRETATION_PHILOSOPHY.md](docs/INTERPRETATION_PHILOSOPHY.md)
- [docs/DIAGNOSTIC_HYPOTHESIS_FRAMEWORK.md](docs/DIAGNOSTIC_HYPOTHESIS_FRAMEWORK.md)
- [docs/OPPORTUNITY_PHILOSOPHY.md](docs/OPPORTUNITY_PHILOSOPHY.md)
- [docs/CONFIDENCE_SCORING.md](docs/CONFIDENCE_SCORING.md)
- [docs/NARRATIVE_GENERATION.md](docs/NARRATIVE_GENERATION.md)
- [docs/KNOWLEDGE_SOURCE_PLAN.md](docs/KNOWLEDGE_SOURCE_PLAN.md)
- [docs/BUILD_GUARDRAILS.md](docs/BUILD_GUARDRAILS.md)
- [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)
