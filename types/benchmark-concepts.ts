import type { LeverKey } from "@/types/diagnostic-output";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type BenchmarkConceptFamily =
  | "KVI"
  | "Architecture"
  | "Zoning"
  | "Promotions"
  | "Markdown"
  | "Governance"
  | "ValuePerception"
  | "CategoryRoles"
  | "ItemRoles";

export type BenchmarkConceptStatus =
  | "concept_defined"
  | "pending_alignment"
  | "linked_to_patterns"
  | "draft_rule_candidate";

export type RuleCandidateStatus =
  | "concept_only"
  | "pending_alignment"
  | "draft_candidate"
  | "approved_for_future_build";

export type ConfidenceLevel = "low" | "medium" | "high";

export type RationaleTemplate = {
  id: string;
  templateName: string;
  applicableContexts: string[];
  rationaleText: string;
};

export type ConfidenceTemplate = {
  id: string;
  confidenceLevel: ConfidenceLevel;
  explanation: string;
  evidenceRequirements: string[];
};

export type FutureRuleCandidate = {
  id: string;
  ruleName: string;
  ruleFamily: BenchmarkConceptFamily;
  description: string;
  status: RuleCandidateStatus;
  supportingConcepts: string[];
  benchmarkDependencies: string[];
  notes: string;
};

export type BenchmarkConcept = {
  id: string;
  conceptName: string;
  conceptFamily: BenchmarkConceptFamily;
  description: string;
  supportingEvidence: string[];
  relatedPatternFeatures: string[];
  relatedLeverKeys: LeverKey[];
  futureRuleCandidates: string[];
  status: BenchmarkConceptStatus;
  applicableArchetypes: RetailerArchetypeId[];
};
