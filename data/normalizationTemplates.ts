import type { UploadFileType } from "@/types/ingestion";

/** Placeholder detected columns per file type for UI preview only. */
export const PLACEHOLDER_DETECTED_COLUMNS: Record<UploadFileType, string[]> = {
  price_file: [
    "ITEM_NBR",
    "RETAIL_PRICE",
    "STORE_ID",
    "MARKET_ZONE",
    "EFFECTIVE_DATE",
  ],
  product_master: ["SKU", "BRAND", "CATEGORY", "SUBCATEGORY", "PACK_SIZE"],
  store_zone_file: ["STORE_ID", "PRICING_ZONE", "REGION"],
  sales_volume_file: ["ITEM_NBR", "SALES_DOLLARS", "QTY", "STORE_ID"],
  margin_cost_file: ["SKU", "UNIT_COST", "MARGIN_PCT"],
  promotion_file: ["SKU", "PROMO_FLAG", "PROMO_PRICE", "START_DATE"],
  markdown_file: ["SKU", "MARKDOWN_FLAG", "MARKDOWN_PRICE"],
  optional_context_document: [],
};

export const PLACEHOLDER_PREVIEW_NOTE =
  "Placeholder normalization preview only. No files are parsed or stored.";
