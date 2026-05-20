import type { CanonicalFieldKey } from "@/types/upload-schema";

/**
 * Deterministic column header synonyms for normalization only.
 * Not benchmark rules or pricing logic.
 */
export const FIELD_SYNONYMS: Record<CanonicalFieldKey, string[]> = {
  sku: [
    "sku",
    "item_nbr",
    "item_number",
    "item_id",
    "product_id",
    "sku_id",
  ],
  productName: ["product_name", "item_desc", "description", "product_desc"],
  brand: ["brand", "brand_name", "manufacturer"],
  category: ["category", "dept", "department", "category_name"],
  subcategory: ["subcategory", "sub_category", "sub_dept"],
  price: [
    "price",
    "retail_price",
    "current_price",
    "shelf_price",
    "reg_price",
    "list_price",
  ],
  unitPrice: ["unit_price", "price_per_unit", "normalized_price"],
  packSize: ["pack_size", "size", "pack", "package_size"],
  sizeUnit: ["size_unit", "uom", "unit_of_measure"],
  upc: ["upc", "upc_code", "gtin", "barcode"],
  store: ["store", "store_id", "store_nbr", "location_id"],
  zone: ["zone", "pricing_zone", "cluster", "market_zone", "price_zone"],
  region: ["region", "market", "geo_region"],
  revenue: ["revenue", "sales", "sales_dollars", "net_sales", "dollar_sales"],
  units: ["units", "unit_sales", "qty", "quantity", "volume"],
  cost: ["cost", "unit_cost", "product_cost"],
  margin: ["margin", "margin_pct", "margin_percent", "gross_margin"],
  promoFlag: ["promo_flag", "on_promo", "promotion_flag", "is_promo"],
  promoPrice: ["promo_price", "promotional_price", "deal_price"],
  markdownFlag: ["markdown_flag", "clearance_flag", "is_markdown"],
  markdownPrice: ["markdown_price", "clearance_price"],
  effectiveDate: [
    "effective_date",
    "start_date",
    "observed_date",
    "price_date",
  ],
  endDate: ["end_date", "promo_end", "markdown_end"],
  kviFlag: ["kvi_flag", "is_kvi", "kvi"],
  privateLabelFlag: ["private_label", "private_label_flag", "own_brand"],
};
