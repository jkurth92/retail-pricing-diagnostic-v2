import { STORYLINE_GUARDRAIL, STORYLINE_NOTES } from "@/data/storylineTemplates";
import { buildExecutiveSummaryBlock } from "@/lib/executiveSummaryEngine";
import { buildFullExportArtifacts } from "@/lib/export/buildExportDeliverables";
import { buildExportPackage } from "@/lib/exportScaffold";
import { buildOpportunityOverviewNarrative } from "@/lib/opportunityOverview";
import { calibrateReadoutImplications } from "@/lib/outputCalibration";
import { buildStorylineSections } from "@/lib/storylineBuilder";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";
import type { EprScores } from "@/types/ui";
import type { ExportPackage } from "@/types/export-structure";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { StorylineExportTree } from "@/lib/export/storylineExport";

export type ExecutiveDeliverableInput = {
  knowledge: KnowledgeRegistryContext;
  storylineResult: StorylineSynthesisResult;
  eprScores: EprScores;
  retailerDisplayName?: string;
  strategicContext?: string;
  enrichment?: RetailerEnrichmentBundle | null;
  computedEvidence?: ComputedEvidenceBundle;
  opportunityExposure?: OpportunityExposureBundle | null;
};

export function runExecutiveDeliverableEngine(
  input: ExecutiveDeliverableInput,
): DiagnosticReadout & {
  exportPackage: ExportPackage;
  exportBundle: ExportDeliverableBundle;
  storylineExport: StorylineExportTree;
} {
  const { storylineResult } = input;
  const { storyline, opportunity } = storylineResult;
  const retailerName = input.retailerDisplayName?.trim() || "The retailer";

  const allThemes = [
    ...storyline.primaryThemes,
    ...storyline.secondaryThemes,
  ];

  const executiveSummary = buildExecutiveSummaryBlock(
    input.knowledge,
    storylineResult,
    input.eprScores,
    retailerName,
    input.strategicContext,
    input.enrichment,
    input.computedEvidence,
    input.opportunityExposure,
  );

  const storylineSections = buildStorylineSections(
    executiveSummary.retailerProfile,
    storyline,
    opportunity,
    allThemes,
  );

  const opportunityOverview = buildOpportunityOverviewNarrative(
    storylineResult,
    storyline.primaryThemes,
  );

  const readout = calibrateReadoutImplications({
    engineVersion: "7.1.0-evidence",
    generatedAt: new Date().toISOString(),
    guardrailMessage:
      "Executive diagnostic readout — narrative-first, deterministic, and non-prescriptive. Not optimization software or tactical pricing guidance.",
    executiveSummary,
    storylineSections,
    opportunityOverview,
    opportunityDetail: opportunity,
    strategicImplications: executiveSummary.strategicImplications,
    supportingThemes: allThemes,
    notes: [
      STORYLINE_GUARDRAIL,
      ...STORYLINE_NOTES,
      "Step 11 generates editable consulting exports (email, DOCX memo, PPTX deck) from this readout.",
    ],
  });

  const { bundle, legacyPackage, storylineTree } = buildFullExportArtifacts(
    readout,
    retailerName,
  );
  const exportPackage = legacyPackage ?? buildExportPackage(readout, retailerName);

  return {
    ...readout,
    exportPackage,
    exportBundle: bundle,
    storylineExport: storylineTree,
  };
}
