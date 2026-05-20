import { FILE_TYPE_DEFINITIONS } from "@/data/fileTypeDefinitions";
import {
  PLACEHOLDER_DETECTED_COLUMNS,
  PLACEHOLDER_PREVIEW_NOTE,
} from "@/data/normalizationTemplates";
import {
  buildFieldMappingsFromCandidates,
  matchDetectedColumns,
} from "@/lib/columnMatcher";
import {
  evaluateDatasetReadiness,
  buildPreviewUploadFile,
} from "@/lib/readinessEvaluator";
import {
  evaluateDiagnosticUnlocks,
  groupUnlocksByStatus,
} from "@/lib/diagnosticUnlocks";
import type { NormalizedDatasetSummary } from "@/types/normalization";
import type { UploadFileType } from "@/types/ingestion";

const PLACEHOLDER_FILE_NAMES: Record<UploadFileType, string> = {
  price_file: "client_price_extract_q1.csv",
  product_master: "product_master_2025.csv",
  store_zone_file: "store_zone_map.csv",
  sales_volume_file: "weekly_sales_volume.csv",
  margin_cost_file: "unit_cost_margin.csv",
  promotion_file: "promo_calendar.csv",
  markdown_file: "markdown_events.csv",
  optional_context_document: "category_strategy_brief.pdf",
};

export function buildPlaceholderIngestionDataset(): NormalizedDatasetSummary & {
  previewNote: string;
  leverUnlocks: ReturnType<typeof evaluateDiagnosticUnlocks>;
  unlockGroups: ReturnType<typeof groupUnlocksByStatus>;
} {
  const uploadedFiles = FILE_TYPE_DEFINITIONS.map((def) =>
    buildPreviewUploadFile(
      def.fileType,
      PLACEHOLDER_DETECTED_COLUMNS[def.fileType],
      PLACEHOLDER_FILE_NAMES[def.fileType],
    ),
  );

  const datasetEval = evaluateDatasetReadiness(uploadedFiles);
  const leverUnlocks = evaluateDiagnosticUnlocks(datasetEval.normalizedFields);
  const unlockGroups = groupUnlocksByStatus(leverUnlocks);
  const diagnosticCoveragePct =
    leverUnlocks.length > 0
      ? Math.round(
          (leverUnlocks.filter(
            (u) => u.status === "available" || u.status === "ready",
          ).length /
            leverUnlocks.length) *
            1000,
        ) / 10
      : null;

  const fieldMappings = FILE_TYPE_DEFINITIONS.flatMap((def) => {
    const candidates = matchDetectedColumns(
      PLACEHOLDER_DETECTED_COLUMNS[def.fileType],
    );
    return buildFieldMappingsFromCandidates(
      candidates,
      def.fileType,
      def.requiredCanonicalFields,
    );
  });

  return {
    previewNote: PLACEHOLDER_PREVIEW_NOTE,
    leverUnlocks,
    unlockGroups,
    uploadedFiles,
    normalizedFields: datasetEval.normalizedFields,
    missingFields: datasetEval.missingFields,
    readinessSummary: datasetEval.readinessSummary,
    normalizationIssues: datasetEval.issues,
    fieldMappings,
    score: {
      fieldCoveragePct: datasetEval.fieldCoveragePct,
      fileCoveragePct: datasetEval.fileCoveragePct,
      rowCoveragePct: datasetEval.rowCoveragePct,
      diagnosticCoveragePct,
    },
  };
}
