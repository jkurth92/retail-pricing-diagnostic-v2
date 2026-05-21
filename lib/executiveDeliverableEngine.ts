import { STORYLINE_GUARDRAIL, STORYLINE_NOTES } from "@/data/storylineTemplates";
import { buildExecutiveSummaryBlock } from "@/lib/executiveSummaryEngine";
import { buildExportPackage } from "@/lib/exportScaffold";
import { buildOpportunityOverviewNarrative } from "@/lib/opportunityOverview";
import { calibrateReadoutImplications } from "@/lib/outputCalibration";
import { buildStorylineSections } from "@/lib/storylineBuilder";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";
import type { EprScores } from "@/types/ui";
import type { ExportPackage } from "@/types/export-structure";

export type ExecutiveDeliverableInput = {
  knowledge: KnowledgeRegistryContext;
  storylineResult: StorylineSynthesisResult;
  eprScores: EprScores;
  retailerDisplayName?: string;
  strategicContext?: string;
  enrichment?: RetailerEnrichmentBundle | null;
};

export function runExecutiveDeliverableEngine(
  input: ExecutiveDeliverableInput,
): DiagnosticReadout & { exportPackage: ExportPackage } {
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
    engineVersion: "7.0.0",
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
      "Step 7 packages hypotheses into an executive deliverable for future memo/deck export.",
    ],
  });

  const exportPackage = buildExportPackage(readout, retailerName);

  return { ...readout, exportPackage };
}
