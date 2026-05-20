import type { UploadFileKind } from "@/types/data-readiness";
import type { UploadFileType } from "@/types/ingestion";

const TO_KIND: Record<UploadFileType, UploadFileKind> = {
  price_file: "price_file",
  product_master: "product_master",
  store_zone_file: "store_zone",
  sales_volume_file: "sales_volume",
  margin_cost_file: "margin_cost",
  promotion_file: "promotion",
  markdown_file: "markdown",
  optional_context_document: "context_documents",
};

const FROM_KIND: Record<UploadFileKind, UploadFileType> = {
  price_file: "price_file",
  product_master: "product_master",
  store_zone: "store_zone_file",
  sales_volume: "sales_volume_file",
  margin_cost: "margin_cost_file",
  promotion: "promotion_file",
  markdown: "markdown_file",
  context_documents: "optional_context_document",
};

export function uploadFileTypeToKind(type: UploadFileType): UploadFileKind {
  return TO_KIND[type];
}

export function uploadFileKindToType(kind: UploadFileKind): UploadFileType {
  return FROM_KIND[kind];
}
