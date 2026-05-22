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
import { runRobustDataInterpretation } from "@/lib/robustDataInterpretation";
import type { RobustDataInterpretationBundle } from "@/types/data-interpretation";
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

export function buildPlaceholderIngestionDataset(
  options?: {
    categoryNames?: string[];
    archetypeId?: import("@/types/retailer-archetypes").RetailerArchetypeId;
    retailerTicker?: string | null;
  },
): NormalizedDatasetSummary & {
  previewNote: string;
  leverUnlocks: ReturnType<typeof evaluateDiagnosticUnlocks>;
  unlockGroups: ReturnType<typeof groupUnlocksByStatus>;
  detectedColumns: string[];
  dataInterpretation: RobustDataInterpretationBundle;
} {
  const uploadedFiles = FILE_TYPE_DEFINITIONS.map((def) =>
    buildPreviewUploadFile(
      def.fileType,
      PLACEHOLDER_DETECTED_COLUMNS[def.fileType],
      PLACEHOLDER_FILE_NAMES[def.fileType],
    ),
  );

  const datasetEval = evaluateDatasetReadiness(uploadedFiles);

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

  const detectedColumns = FILE_TYPE_DEFINITIONS.flatMap(
    (def) => PLACEHOLDER_DETECTED_COLUMNS[def.fileType],
  );

  const dataInterpretation = runRobustDataInterpretation({
    detectedColumns,
    normalizedFields: datasetEval.normalizedFields,
    categoryNames: options?.categoryNames ?? [],
    archetypeId: options?.archetypeId ?? "mass",
    retailerTicker: options?.retailerTicker ?? null,
  });

  const leverUnlocksResolved = evaluateDiagnosticUnlocks(
    dataInterpretation.effectiveNormalizedFields,
  );
  const diagnosticCoveragePct =
    leverUnlocksResolved.length > 0
      ? Math.round(
          (leverUnlocksResolved.filter(
            (u) => u.status === "available" || u.status === "ready",
          ).length /
            leverUnlocksResolved.length) *
            1000,
        ) / 10
      : null;

  return {
    previewNote: PLACEHOLDER_PREVIEW_NOTE,
    leverUnlocks: leverUnlocksResolved,
    unlockGroups: groupUnlocksByStatus(leverUnlocksResolved),
    detectedColumns,
    dataInterpretation,
    uploadedFiles,
    normalizedFields: dataInterpretation.effectiveNormalizedFields,
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
