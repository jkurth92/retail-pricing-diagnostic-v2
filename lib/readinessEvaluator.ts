import { CANONICAL_FIELD_CATALOG } from "@/data/uploadFieldCatalog";
import { getFileTypeDefinition } from "@/data/fileTypeDefinitions";
import type { UploadReadinessState } from "@/types/data-readiness";
import type { ColumnCandidate } from "@/types/column-mapping";
import type { NormalizationIssue } from "@/types/normalization";
import type { UploadFile, UploadFileType } from "@/types/ingestion";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import { matchDetectedColumns } from "@/lib/columnMatcher";

export type ReadinessEvaluation = {
  readinessState: UploadReadinessState;
  normalizationStatus: import("@/types/normalization").NormalizationStatus;
  fieldCoveragePct: number | null;
  fileCoveragePct: number | null;
  rowCoveragePct: number | null;
  issues: NormalizationIssue[];
  normalizedFields: CanonicalFieldKey[];
  missingRequired: CanonicalFieldKey[];
};

function uniqueNormalizedFields(
  files: { candidates: ColumnCandidate[] }[],
): CanonicalFieldKey[] {
  const set = new Set<CanonicalFieldKey>();
  for (const file of files) {
    for (const c of file.candidates) {
      if (c.normalizedField) set.add(c.normalizedField);
    }
  }
  return Array.from(set);
}

export function evaluateFileReadiness(
  fileType: UploadFileType,
  detectedColumns: string[],
  isPlaceholderPreview: boolean,
): ReadinessEvaluation {
  const def = getFileTypeDefinition(fileType);
  const candidates = matchDetectedColumns(detectedColumns);
  const required = def?.requiredCanonicalFields ?? [];
  const normalizedFields = candidates
    .filter((c) => c.normalizedField)
    .map((c) => c.normalizedField as CanonicalFieldKey);

  const missingRequired = required.filter(
    (f) => !normalizedFields.includes(f),
  );

  const issues: NormalizationIssue[] = [];
  for (const f of missingRequired) {
    issues.push({
      type: "missing_required_field",
      message: `Required canonical field missing: ${f}`,
      field: f,
      sourceColumn: null,
    });
  }

  for (const c of candidates) {
    if (c.requiresReview && c.normalizedField) {
      issues.push({
        type: "low_mapping_confidence",
        message: `Review mapping: ${c.sourceColumn} → ${c.normalizedField}`,
        field: c.normalizedField,
        sourceColumn: c.sourceColumn,
      });
    }
    if (!c.normalizedField) {
      issues.push({
        type: "unsupported_format",
        message: `Unmapped column: ${c.sourceColumn}`,
        field: null,
        sourceColumn: c.sourceColumn,
      });
    }
  }

  const mappedRequiredCount = required.filter((f) =>
    normalizedFields.includes(f),
  ).length;
  const fieldCoveragePct =
    required.length > 0
      ? Math.round((mappedRequiredCount / required.length) * 1000) / 10
      : null;

  let normalizationStatus: import("@/types/normalization").NormalizationStatus =
    "not_started";
  let readinessState: UploadReadinessState = "not_uploaded";

  if (isPlaceholderPreview) {
    if (detectedColumns.length === 0) {
      normalizationStatus = "not_started";
      readinessState = "not_uploaded";
    } else if (missingRequired.length > 0) {
      normalizationStatus = "partially_normalized";
      readinessState = "normalization_partial";
    } else if (candidates.some((c) => c.requiresReview)) {
      normalizationStatus = "mapping_in_progress";
      readinessState = "upload_complete";
    } else {
      normalizationStatus = "normalized";
      readinessState = "normalization_complete";
    }
  }

  return {
    readinessState,
    normalizationStatus,
    fieldCoveragePct,
    fileCoveragePct: null,
    rowCoveragePct: isPlaceholderPreview ? null : null,
    issues,
    normalizedFields,
    missingRequired,
  };
}

export function evaluateDatasetReadiness(
  files: UploadFile[],
): {
  readinessSummary: UploadReadinessState;
  fieldCoveragePct: number | null;
  fileCoveragePct: number | null;
  rowCoveragePct: number | null;
  diagnosticCoveragePct: number | null;
  normalizedFields: CanonicalFieldKey[];
  missingFields: CanonicalFieldKey[];
  issues: NormalizationIssue[];
} {
  const previewFiles = files.filter((f) => f.status === "placeholder_preview");
  const normalizedFields = uniqueNormalizedFields(
    previewFiles.map((f) => ({ candidates: f.mappedColumns })),
  );

  const globalRequired = CANONICAL_FIELD_CATALOG.filter(
    (f) => f.canonicalRequirement === "required",
  ).map((f) => f.key);

  const missingFields = globalRequired.filter(
    (f) => !normalizedFields.includes(f),
  );

  const fileCoveragePct =
    files.length > 0
      ? Math.round(
          (previewFiles.length / Math.max(files.length, 1)) * 1000,
        ) / 10
      : null;

  const fieldCoveragePct =
    globalRequired.length > 0
      ? Math.round(
          ((globalRequired.length - missingFields.length) /
            globalRequired.length) *
            1000,
        ) / 10
      : null;

  const issues = previewFiles.flatMap((f) =>
    evaluateFileReadiness(f.fileType, f.detectedColumns, true).issues,
  );

  let readinessSummary: UploadReadinessState = "not_uploaded";
  if (previewFiles.length > 0) {
    if (missingFields.length === 0 && issues.length === 0) {
      readinessSummary = "diagnostics_ready";
    } else if (normalizedFields.length > 0) {
      readinessSummary = "diagnostics_limited";
    } else {
      readinessSummary = "normalization_partial";
    }
  }

  return {
    readinessSummary,
    fieldCoveragePct,
    fileCoveragePct,
    rowCoveragePct: null,
    diagnosticCoveragePct: null,
    normalizedFields,
    missingFields,
    issues,
  };
}

export function buildPreviewUploadFile(
  fileType: UploadFileType,
  detectedColumns: string[],
  originalFileName: string,
): UploadFile {
  const evalResult = evaluateFileReadiness(
    fileType,
    detectedColumns,
    true,
  );
  const candidates = matchDetectedColumns(detectedColumns);
  return {
    id: `preview-${fileType}`,
    fileType,
    uploadedAt: "Placeholder preview",
    originalFileName,
    status: "placeholder_preview",
    rowCount: null,
    detectedColumns,
    mappedColumns: candidates,
    normalizationStatus: evalResult.normalizationStatus,
    readinessState: evalResult.readinessState,
    diagnosticsUnlocked: [],
    notes: "Placeholder normalization preview only.",
  };
}
