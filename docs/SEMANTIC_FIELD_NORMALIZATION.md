# Semantic field normalization (Step 15)

## Purpose

Map messy retailer column headers to the canonical internal schema without requiring perfect field names.

## Modules

| Module | Role |
|--------|------|
| `data/fieldSynonyms.ts` | Deterministic synonym and abbreviation catalog |
| `lib/fieldNormalization.ts` | Header tokenization, exact/synonym/fuzzy match |
| `lib/semanticFieldResolver.ts` | Effective field set = mapped columns + proxy inference |
| `lib/columnMatcher.ts` | UI preview mappings (delegates to field normalization) |

## Methods

1. **Exact / synonym** — `reg_prc` → `price`, `item_nbr` → `sku`
2. **Fuzzy** — token overlap and substring similarity (≥ 0.55 confidence)
3. **Proxy inference** — when columns are missing but scope supports inference

## Principles

- Explainable mappings with confidence scores
- No black-box embeddings
- Consultant review flag when confidence &lt; 0.85
