import type { UploadFileType } from "@/types/ingestion";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type FileTypeDefinition = {
  fileType: UploadFileType;
  label: string;
  purpose: string;
  expectedColumns: string[];
  requiredCanonicalFields: CanonicalFieldKey[];
  recommendedCanonicalFields: CanonicalFieldKey[];
};

export const FILE_TYPE_DEFINITIONS: FileTypeDefinition[] = [
  {
    fileType: "price_file",
    label: "Price file",
    purpose: "Observed shelf or list prices by SKU and location.",
    expectedColumns: [
      "ITEM_NBR",
      "RETAIL_PRICE",
      "STORE_ID",
      "MARKET_ZONE",
      "EFFECTIVE_DATE",
    ],
    requiredCanonicalFields: ["sku", "price"],
    recommendedCanonicalFields: ["store", "zone", "effectiveDate"],
  },
  {
    fileType: "product_master",
    label: "Product master",
    purpose: "SKU attributes for normalization.",
    expectedColumns: ["SKU", "BRAND", "CATEGORY", "PACK_SIZE"],
    requiredCanonicalFields: ["sku"],
    recommendedCanonicalFields: ["brand", "category", "productName"],
  },
  {
    fileType: "store_zone_file",
    label: "Store / zone file",
    purpose: "Geographic pricing zones.",
    expectedColumns: ["STORE_ID", "PRICING_ZONE", "REGION"],
    requiredCanonicalFields: ["zone"],
    recommendedCanonicalFields: ["store", "region"],
  },
  {
    fileType: "sales_volume_file",
    label: "Sales / volume file",
    purpose: "Revenue and unit weighting for evidence.",
    expectedColumns: ["ITEM_NBR", "SALES_DOLLARS", "QTY"],
    requiredCanonicalFields: ["sku"],
    recommendedCanonicalFields: ["revenue", "units"],
  },
  {
    fileType: "margin_cost_file",
    label: "Margin / cost file",
    purpose: "Unit economics context.",
    expectedColumns: ["SKU", "UNIT_COST", "MARGIN_PCT"],
    requiredCanonicalFields: ["sku"],
    recommendedCanonicalFields: ["cost"],
  },
  {
    fileType: "promotion_file",
    label: "Promotion file",
    purpose: "Promotional pricing events.",
    expectedColumns: ["SKU", "PROMO_FLAG", "PROMO_PRICE"],
    requiredCanonicalFields: ["sku"],
    recommendedCanonicalFields: ["promoFlag", "promoPrice"],
  },
  {
    fileType: "markdown_file",
    label: "Markdown file",
    purpose: "Clearance pricing signals.",
    expectedColumns: ["SKU", "MARKDOWN_FLAG", "MARKDOWN_PRICE"],
    requiredCanonicalFields: ["sku"],
    recommendedCanonicalFields: ["markdownFlag", "markdownPrice"],
  },
  {
    fileType: "optional_context_document",
    label: "Optional context documents",
    purpose: "Narrative context — not mapped to pricing rows.",
    expectedColumns: [],
    requiredCanonicalFields: [],
    recommendedCanonicalFields: [],
  },
];

export function getFileTypeDefinition(
  fileType: UploadFileType,
): FileTypeDefinition | undefined {
  return FILE_TYPE_DEFINITIONS.find((d) => d.fileType === fileType);
}
