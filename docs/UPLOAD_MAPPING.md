# Upload Column Mapping

## Purpose

Map heterogeneous client column headers into the canonical schema (`CanonicalFieldKey`) before any diagnostic logic runs.

## Mapping methods

| Method | Description |
|--------|-------------|
| exact_match | Header equals canonical key |
| synonym_match | Header matches entry in `data/fieldSynonyms.ts` |
| fuzzy_match | Substring overlap score ≥ 60% |
| user_selected | Future: analyst override |
| unmapped | No confident target field |

## Example (placeholder preview)

| Source column | Canonical field | Method |
|---------------|-----------------|--------|
| ITEM_NBR | sku | synonym_match |
| RETAIL_PRICE | price | synonym_match |
| SALES_DOLLARS | revenue | synonym_match |
| MARKET_ZONE | zone | synonym_match |

## Confidence and review

- Confidence is a deterministic score (0–1), not a model probability.
- Mappings below 85% confidence or fuzzy matches enter the **mapping review queue**.
- Review does not change pricing outcomes — only data readiness.

## Implementation

- [`lib/columnMatcher.ts`](../lib/columnMatcher.ts)
- [`data/fieldSynonyms.ts`](../data/fieldSynonyms.ts)
- [`types/column-mapping.ts`](../types/column-mapping.ts)

## Not implemented

- Real CSV/Excel parsing
- Persistent mapping templates per client
- AI-suggested mappings
