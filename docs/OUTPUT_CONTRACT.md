# Diagnostic Output Contract (v2)

## Purpose

This document defines the structured output contract for the Retail Pricing Diagnostic engine. Step 2 introduces types and placeholder data only — no calculation engine is active.

## Design principles

- Numeric fields that will be calculated later use `number | null`.
- Status enums describe readiness, not fabricated results.
- UI labels use plain language: "Not calculated," "Pending external data," "Requires alignment."
- Evidence and assumptions are traceable to source types.
- AI narrative explains supported outputs; it does not invent opportunity values.

## Output hierarchy

```
DiagnosticRunOutput
├── ClientContextSummary
├── ScopeDefinition
├── RetailerOverviewOutput
├── ObservedPricingPatternsOutput
├── TotalOpportunitySummary
├── LeverOpportunityOutput[] (per lever)
├── FindingOutput[]
├── EvidenceItem[]
├── AssumptionItem[]
├── UserOverrideItem[]
├── ConfidenceSummary
├── MemoReadinessSummary
└── DataReadinessSummary
```

## Core types

Implemented in:

- [`types/diagnostic-output.ts`](../types/diagnostic-output.ts)
- [`types/scope.ts`](../types/scope.ts)
- [`types/retailer-overview.ts`](../types/retailer-overview.ts)
- [`types/observed-patterns.ts`](../types/observed-patterns.ts)
- [`types/competitors.ts`](../types/competitors.ts) — `CompetitorCandidate`, `CompetitorSet`
- [`types/data-readiness.ts`](../types/data-readiness.ts) — `DataReadinessModel`, `UploadReadinessEntry`
- [`types/rules.ts`](../types/rules.ts) — disabled rule library scaffold

Placeholder instances:

- [`data/placeholderDiagnosticOutput.ts`](../data/placeholderDiagnosticOutput.ts)
- [`data/uploadReadinessPlaceholders.ts`](../data/uploadReadinessPlaceholders.ts)
- [`data/ruleLibraryPlaceholder.ts`](../data/ruleLibraryPlaceholder.ts)

Engine shell: [`lib/diagnostic-engine/runDiagnostic.ts`](../lib/diagnostic-engine/runDiagnostic.ts)

### DiagnosticRunOutput

Top-level run envelope with status, workflow step, and nested summaries.

### ScopeDefinition

Defines the sizing denominator only:

- Total retailer revenue
- Addressable revenue percentage and derived value (scope math allowed)
- Revenue in diagnostic scope
- Category and lever scope selections

**Does not** calculate opportunity.

### CompetitorSet / CompetitorCandidate

Local competitor entries for retailer overview context. Each `CompetitorCandidate` includes `validationStatus: requires_validation` and `usageNote: overview_only`. Suggestions are seed-based, not benchmarks. **Does not** affect opportunity sizing.

### DataReadinessModel

Per-upload readiness structure with required / recommended / optional fields, diagnostics availability (`unavailable` | `limited` | `available`), and parsing status. Placeholder only until schema alignment.

### Rule library and engine (scaffold)

Disabled rules in `RuleLibrary` with `thresholdConfig: null` and `formulaConfig: null`. `runDiagnosticEngine` returns `pending_alignment` and null opportunity values.

### RetailerOverviewOutput

Retailer header, financial metric placeholders, peer comparison placeholders, insights placeholder, and news placeholders. All external values remain pending.

### ObservedPricingPatternsOutput

Per-lever pattern sections with evidence, findings, and opportunity impact labels — all pending until uploads, features, and rules are aligned.

### LeverOpportunityOutput

Per-lever opportunity structure with null amounts, pending calculation status, and alignment notes.

### FindingOutput

Structured finding records linked to levers and evidence (empty in placeholder).

### EvidenceItem

Typed evidence sources: client upload, user input, public data, benchmark rule, consultant override.

### AssumptionItem

Future assumption categories without values until alignment.

### UserOverrideItem

Future override slots (disabled in UI until engine exists).

### ConfidenceSummary

Overall and per-lever confidence — `not_assessed` in Step 2.

### MemoReadinessSummary

Readiness flags for executive summary, findings, evidence, assumptions, recommendations.

## Explicitly not implemented yet

- Opportunity sizing formulas
- Benchmark thresholds and rule evaluation
- Peer median calculations
- Upload parsing and feature generation
- External data APIs
- AI-generated recommendations
- Confidence scoring logic
- Memo generation

## Step 2 UI mapping

| Workflow step | Contract section |
|---------------|------------------|
| Client Context | `ClientContextSummary`, competitor set (local) |
| Client Uploads | `DataReadinessSummary` (pending) |
| Retailer Overview | `RetailerOverviewOutput` |
| Scope of Diagnostic | `ScopeDefinition` |
| Observed Pricing Patterns | `ObservedPricingPatternsOutput` |
| Opportunity Size | `TotalOpportunitySummary`, `LeverOpportunityOutput[]` |
