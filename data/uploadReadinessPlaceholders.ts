import type { DataReadinessModel } from "@/types/data-readiness";

const NOT_IMPLEMENTED_NOTE =
  "Upload parsing and readiness scoring are not implemented. Schema alignment required.";

export const UPLOAD_READINESS_PLACEHOLDER: DataReadinessModel = {
  overallStatus: "pending_alignment",
  summaryNotes: [
    "No files are parsed or stored in this build.",
    "Readiness scoring will activate after canonical upload schema alignment.",
    "Diagnostics availability remains unavailable until uploads and rules are aligned.",
  ],
  uploads: [
    {
      kind: "price_file",
      label: "Price file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
        {
          name: "list_price",
          requirement: "required",
          description: "Observed price",
        },
      ],
      recommendedFields: [
        {
          name: "store_id",
          requirement: "recommended",
          description: "Store or zone key",
        },
        {
          name: "observed_date",
          requirement: "recommended",
          description: "Observation date",
        },
      ],
      optionalFields: [
        {
          name: "zone",
          requirement: "optional",
          description: "Pricing zone",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "product_master",
      label: "Product master",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
      ],
      recommendedFields: [
        {
          name: "category",
          requirement: "recommended",
          description: "Category rollup",
        },
        {
          name: "brand",
          requirement: "recommended",
          description: "Brand attribute",
        },
      ],
      optionalFields: [
        {
          name: "pack_size",
          requirement: "optional",
          description: "Pack size text",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "store_zone",
      label: "Store / zone file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "store_id",
          requirement: "required",
          description: "Store identifier",
        },
      ],
      recommendedFields: [
        {
          name: "zone",
          requirement: "recommended",
          description: "Zone mapping",
        },
      ],
      optionalFields: [
        {
          name: "region",
          requirement: "optional",
          description: "Region label",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "sales_volume",
      label: "Sales / volume file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
      ],
      recommendedFields: [
        {
          name: "units",
          requirement: "recommended",
          description: "Unit volume",
        },
        {
          name: "revenue",
          requirement: "recommended",
          description: "Revenue weight",
        },
      ],
      optionalFields: [],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "margin_cost",
      label: "Margin / cost file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
      ],
      recommendedFields: [
        {
          name: "unit_cost",
          requirement: "recommended",
          description: "Unit cost",
        },
      ],
      optionalFields: [
        {
          name: "margin_pct",
          requirement: "optional",
          description: "Margin percent",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "promotion",
      label: "Promotion file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
      ],
      recommendedFields: [
        {
          name: "promo_price",
          requirement: "recommended",
          description: "Promotional price",
        },
      ],
      optionalFields: [
        {
          name: "mechanic",
          requirement: "optional",
          description: "Promo mechanic",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "markdown",
      label: "Markdown file",
      status: "not_uploaded",
      requiredFields: [
        {
          name: "sku_id",
          requirement: "required",
          description: "Product identifier",
        },
      ],
      recommendedFields: [
        {
          name: "markdown_price",
          requirement: "recommended",
          description: "Markdown price",
        },
      ],
      optionalFields: [],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
    {
      kind: "context_documents",
      label: "Optional context documents",
      status: "not_uploaded",
      requiredFields: [],
      recommendedFields: [
        {
          name: "document_type",
          requirement: "recommended",
          description: "Document classification",
        },
      ],
      optionalFields: [
        {
          name: "notes",
          requirement: "optional",
          description: "Analyst notes",
        },
      ],
      diagnosticsAvailability: "unavailable",
      readinessNote: NOT_IMPLEMENTED_NOTE,
      parsingStatus: "pending_alignment",
    },
  ],
};
