import { LEVER_DIAGNOSTIC_REQUIREMENTS } from "@/data/diagnosticAvailabilityMatrix";
import { UPLOAD_FILE_SCHEMAS } from "@/data/uploadFieldCatalog";
import type {
  DataReadinessModel,
  LeverDiagnosticReadiness,
  ReadinessScoreMetrics,
  UploadFileReadinessCard,
} from "@/types/data-readiness";

const PLACEHOLDER_SCORE: ReadinessScoreMetrics = {
  fieldCoveragePct: null,
  fileCoveragePct: null,
  rowCoveragePct: null,
  diagnosticCoveragePct: null,
  dataQualityNotes: [
    "Scoring not active — no files parsed in this build.",
    "Percentages will populate after upload ingestion and normalization.",
  ],
};

const PRE_IMPLEMENTATION_NOTE =
  "Schema defined. File parsing and normalization are not active. Readiness is placeholder-only.";

function buildUploadCard(
  schema: (typeof UPLOAD_FILE_SCHEMAS)[number],
): UploadFileReadinessCard {
  return {
    kind: schema.kind,
    label: schema.label,
    purpose: schema.purpose,
    readinessState: "not_uploaded",
    normalizationLabel: "Pending normalization",
    requiredFieldsPresent: [],
    requiredFieldsMissing: [...schema.requiredFromFile],
    recommendedFieldsMissing: [...schema.recommendedFromFile],
    unlocksDiagnostics: [...schema.contributesToLevers],
    diagnosticsAvailability: "unavailable",
    score: { ...PLACEHOLDER_SCORE },
    readinessNote: PRE_IMPLEMENTATION_NOTE,
  };
}

function buildLeverReadiness(): LeverDiagnosticReadiness[] {
  return LEVER_DIAGNOSTIC_REQUIREMENTS.map((lever) => ({
    leverKey: lever.leverKey,
    label: lever.label,
    availability: "unavailable",
    missingRequiredFields: [...lever.requiredFields],
    readinessState: "not_uploaded",
    note: "Requires normalized canonical fields and aligned diagnostic rules.",
  }));
}

export const UPLOAD_READINESS_MODEL: DataReadinessModel = {
  overallState: "not_uploaded",
  implementationStatus: "schema_defined",
  score: { ...PLACEHOLDER_SCORE },
  leverReadiness: buildLeverReadiness(),
  summaryNotes: [
    "Canonical upload schema v1.0.0 is defined in types and docs.",
    "No files are stored or parsed in this build.",
    "Readiness states and scores are structural placeholders only.",
    "Opportunity sizing and benchmark rules are not derived from uploads.",
  ],
  uploads: UPLOAD_FILE_SCHEMAS.map(buildUploadCard),
};

/** @deprecated Use UPLOAD_READINESS_MODEL */
export const UPLOAD_READINESS_PLACEHOLDER = UPLOAD_READINESS_MODEL;
