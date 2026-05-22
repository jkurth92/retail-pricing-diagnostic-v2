import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type FieldResolutionMethod =
  | "exact_match"
  | "synonym_match"
  | "fuzzy_match"
  | "semantic_inference"
  | "proxy_inferred";

export type FieldResolution = {
  sourceColumn: string;
  canonicalField: CanonicalFieldKey | null;
  method: FieldResolutionMethod;
  confidence: number;
  inferredPurpose?: string;
};

export type CategoryMapping = {
  rawCategory: string;
  normalizedCategory: string;
  method: "exact" | "alias" | "fuzzy" | "hierarchy_inference";
  confidence: number;
};

export type ProxySignalKind =
  | "inferred_tier"
  | "inferred_kvi"
  | "inferred_pl_nb"
  | "inferred_zone"
  | "price_cluster";

export type ProxySignal = {
  id: string;
  kind: ProxySignalKind;
  label: string;
  detail: string;
  confidence: "low" | "medium" | "high";
  supportsFields: CanonicalFieldKey[];
};

export type TierInferenceBand = {
  tier: "entry" | "mainstream" | "premium";
  inferredFrom: string;
  confidence: number;
};

export type EvidenceCoverageDimension = {
  id: string;
  label: string;
  score: number;
  weight: number;
  note: string;
};

export type EvidenceCoverageAssessment = {
  overallScore: number;
  sufficiencyLevel: "low" | "medium" | "high";
  dimensions: EvidenceCoverageDimension[];
  allowsDirectionalOpportunity: boolean;
  rangeWidthMultiplier: number;
  narrativeSeverityScale: number;
};

export type DataQualityAssessment = {
  fieldCoveragePct: number;
  categoryCoveragePct: number;
  explicitFieldCount: number;
  inferredFieldCount: number;
  normalizationConfidence: "low" | "medium" | "high";
  signalCompleteness: "sparse" | "partial" | "adequate";
  consultantNotes: string[];
};

export type RobustDataInterpretationBundle = {
  engineVersion: string;
  effectiveNormalizedFields: CanonicalFieldKey[];
  fieldResolutions: FieldResolution[];
  categoryMappings: CategoryMapping[];
  proxySignals: ProxySignal[];
  tierInference: TierInferenceBand[];
  dataQuality: DataQualityAssessment;
  evidenceCoverage: EvidenceCoverageAssessment;
  inferredVsExplicit: {
    explicit: CanonicalFieldKey[];
    inferred: CanonicalFieldKey[];
  };
};

export type RobustDataInterpretationInput = {
  detectedColumns: string[];
  normalizedFields: CanonicalFieldKey[];
  categoryNames: string[];
  archetypeId: RetailerArchetypeId;
  retailerTicker?: string | null;
};
