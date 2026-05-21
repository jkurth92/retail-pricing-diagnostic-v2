import type { CategoryRoleId } from "@/types/role-inference";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";

export type ElasticityReferenceChannel = "grocery" | "department_store";

/** Per in-scope category exposure for opportunity weighting */
export type CategoryExposureRecord = {
  category: string;
  roleId: CategoryRoleId;
  revenueWeightPct: number;
  roleWeight: number;
  elasticityAbs: number;
  elasticitySensitivity: ElasticitySensitivity;
  elasticitySource: string;
  architectureCompression: boolean;
  plNbNarrow: boolean;
  kviElevated: boolean;
  affectedIssueTags: string[];
  monetizableExposurePct: number;
};

export type OpportunityExposureBundle = {
  engineVersion: string;
  generatedAt: string;
  elasticityChannel: ElasticityReferenceChannel;
  categoryExposures: CategoryExposureRecord[];
  /** Share of in-scope revenue weight with architecture compression */
  architectureAffectedRevenuePct: number;
  plNbAffectedRevenuePct: number;
  kviAffectedRevenuePct: number;
  monetizableExposurePct: number;
  exposureSummaries: string[];
  causalFramingLines: string[];
  portfolioElasticitySensitivity: ElasticitySensitivity;
  elasticityWidthMultiplier: number;
  exposureWidthMultiplier: number;
  evidenceCoverageScore: number;
  maturityModifier: number;
};

export type ThemeExposureContext = {
  bundle: OpportunityExposureBundle;
  /** Categories materially contributing to this theme */
  contributingCategories: string[];
  themeAffectedRevenuePct: number;
  themeElasticitySensitivity: ElasticitySensitivity;
  themeElasticityMultiplier: number;
};
