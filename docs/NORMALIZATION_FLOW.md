# Normalization Flow

## End-to-end path (target state)

```text
Client selects file type
  → Upload (future: storage)
  → Detect columns (future: parser)
  → Match columns (columnMatcher: exact / synonym / fuzzy)
  → User review queue (low confidence / unmapped)
  → Normalize to CanonicalPricingRecord (future: row transform)
  → Readiness evaluation (readinessEvaluator)
  → Diagnostic unlock check (diagnosticUnlocks)
  → Observed patterns (future: after rules aligned)
```

## Step 3b (current)

Only the **placeholder preview** path is active:

1. `PLACEHOLDER_DETECTED_COLUMNS` simulates detected headers.
2. `columnMatcher` proposes canonical mappings with confidence.
3. `readinessEvaluator` sets readiness and normalization status.
4. `diagnosticUnlocks` determines per-lever availability from field union.
5. UI renders summary tables — **no file I/O**.

## Normalization status

| Status | Meaning |
|--------|---------|
| not_started | No columns detected |
| mapping_in_progress | Columns detected; review pending |
| partially_normalized | Some required fields still missing |
| normalized | Required mappings satisfied in preview |
| normalization_failed | Reserved for parse/validation failures |

## Principles

- **Deterministic** — Same inputs produce same mapping suggestions.
- **Explainable** — Each mapping records `mappingMethod` and `confidence`.
- **No pricing conclusions** — Normalization does not score prices or gaps.
- **No benchmarks** — Synonyms are column headers only, not competitive POV.

See also: [`UPLOAD_MAPPING.md`](UPLOAD_MAPPING.md), [`DIAGNOSTIC_AVAILABILITY.md`](DIAGNOSTIC_AVAILABILITY.md).
