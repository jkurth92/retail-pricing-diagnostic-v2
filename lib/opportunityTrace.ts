/**
 * Step 14A — Opportunity trace facade (auditable calculation path).
 * Re-exports trace builders and ties exposure weighting into sizing transparency.
 */

export {
  buildExecutiveThemeOpportunityTrace,
  buildHypothesisOpportunityTrace,
  buildPortfolioOpportunityTrace,
  type OpportunityCalibrationInputs,
} from "@/lib/opportunityCalculationTrace";

export {
  buildThemeExposureContext,
  runOpportunityExposureEngine,
  type OpportunityExposureInput,
} from "@/lib/opportunityExposure";

export { computeRecoverableValuePool } from "@/lib/recoverableValue";
export { computeCategoryExposures } from "@/lib/categoryExposure";

export type {
  OpportunityCalculationTrace,
  OpportunityFinalRange,
  OpportunityTraceRow,
} from "@/types/opportunity-trace";

export type {
  CategoryExposureRecord,
  OpportunityExposureBundle,
  ThemeExposureContext,
} from "@/types/opportunity-exposure";
