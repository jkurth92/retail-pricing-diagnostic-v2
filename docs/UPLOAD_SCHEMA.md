# Canonical Upload Schema (v1.0.0)

## Purpose

Define the single normalized shape the diagnostic engine expects after all client files are mapped, validated, and joined. Step 3 aligns the schema only — **no parsing or storage is active**.

## Normalized record

All uploads map into `NormalizedPricingRecord` (see [`types/upload-schema.ts`](../types/upload-schema.ts)): one row per SKU × location × time observation (conceptually), with canonical field keys.

## Canonical fields

| Field | Label | Canonical requirement | Primary sources |
|-------|-------|----------------------|-----------------|
| sku | SKU | Required | Price, product master, sales, margin, promo, markdown |
| productName | Product name | Recommended | Product master, price |
| brand | Brand | Recommended | Product master |
| category | Category | Recommended | Product master |
| subcategory | Subcategory | Optional | Product master |
| price | Price | Required | Price, promotion, markdown |
| unitPrice | Unit price | Recommended | Price, product master |
| packSize | Pack size | Recommended | Product master |
| sizeUnit | Size unit | Optional | Product master |
| upc | UPC | Optional | Product master, price |
| store | Store | Recommended | Price, store/zone, sales |
| zone | Zone | Recommended | Price, store/zone |
| region | Region | Optional | Store/zone |
| revenue | Revenue | Optional | Sales/volume |
| units | Units | Optional | Sales/volume |
| cost | Cost | Optional | Margin/cost |
| margin | Margin | Optional | Margin/cost |
| promoFlag | Promo flag | Optional | Promotion, price |
| promoPrice | Promo price | Optional | Promotion, price |
| markdownFlag | Markdown flag | Optional | Markdown, price |
| markdownPrice | Markdown price | Optional | Markdown, price |
| effectiveDate | Effective date | Recommended | Price, promotion, markdown |
| endDate | End date | Optional | Promotion, markdown |
| kviFlag | KVI flag | Optional | Product master |
| privateLabelFlag | Private label flag | Optional | Product master |

Full definitions and per-lever needs: [`data/uploadFieldCatalog.ts`](../data/uploadFieldCatalog.ts).

## Upload file types

| File kind | Maps to canonical fields | Contributes to levers |
|-----------|-------------------------|------------------------|
| price_file | sku, price, store, zone, dates, promo/markdown flags | KVI, architecture, zoning, promotions, markdown |
| product_master | sku, attributes, flags | KVI, architecture |
| store_zone | store, zone, region | Zoning |
| sales_volume | sku, revenue, units | Evidence weighting (all levers) |
| margin_cost | sku, cost, margin | Markdown, architecture |
| promotion | sku, promo fields, dates | Promotions, KVI |
| markdown | sku, markdown fields, dates | Markdown |
| context_documents | (none — narrative context) | None |

## Per-lever field needs

Each canonical field declares `leverNeeds` as `required`, `recommended`, `optional`, or `not_needed` for:

- kvis
- price_architecture
- price_zoning
- promotions
- markdown

Matrix summary: [`data/diagnosticAvailabilityMatrix.ts`](../data/diagnosticAvailabilityMatrix.ts).

## Normalization (future)

1. **Ingest** — Client selects file type; raw columns stored temporarily (not in Git).
2. **Map** — Column mapping UI maps source columns → canonical keys per file schema.
3. **Validate** — Required fields per file kind; type coercion; duplicate keys.
4. **Join** — Merge rows on `sku` + `store`/`zone` + `effectiveDate` (rules TBD at implementation).
5. **Emit** — `NormalizedPricingRecord[]` passed to readiness scoring, then diagnostic features.

## Not in scope (Step 3)

- File parsing implementation
- Opportunity or benchmark calculations
- Thresholds for “good” or “bad” pricing
- External APIs

See [`DATA_READINESS.md`](DATA_READINESS.md) for readiness states and scoring.
