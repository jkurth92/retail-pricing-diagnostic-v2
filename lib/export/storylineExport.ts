import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportSection } from "@/types/export-system";
import type { StorylineSection } from "@/types/storyline-sections";

export type StorylineExportNode = {
  sectionId: string;
  headline: string;
  implication: string;
  evidence: string[];
  opportunity: string;
  confidence: string;
  displayOrder: number;
  themes: string[];
};

export type StorylineExportTree = {
  id: string;
  retailerName: string;
  generatedAt: string;
  nodes: StorylineExportNode[];
};

function sectionToNode(section: StorylineSection): StorylineExportNode {
  const implication =
    section.supportingThemes[0]?.summary ??
    section.sectionNarrative.split(".")[0] ??
    section.sectionNarrative;

  return {
    sectionId: section.id,
    headline: section.sectionTitle,
    implication,
    evidence: [
      ...section.supportingSignals.map((s) => s.signalName),
      ...section.supportingThemes.map((t) => t.themeName),
    ].filter(Boolean),
    opportunity: section.opportunitySummary,
    confidence: section.confidenceSummary,
    displayOrder: section.displayOrder,
    themes: section.supportingThemes.map((t) => t.themeName),
  };
}

export function buildStorylineExportTree(
  readout: DiagnosticReadout,
  retailerName: string,
): StorylineExportTree {
  return {
    id: `storyline-export-${readout.executiveSummary.id}`,
    retailerName,
    generatedAt: readout.generatedAt,
    nodes: [...readout.storylineSections]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(sectionToNode),
  };
}

export function storylineNodesToExportSections(
  tree: StorylineExportTree,
  readout: DiagnosticReadout,
): ExportSection[] {
  return tree.nodes.map((node) => {
    const section = readout.storylineSections.find((s) => s.id === node.sectionId);
    return {
      sectionTitle: node.headline,
      summary: section?.sectionNarrative ?? node.implication,
      supportingEvidence: node.evidence,
      strategicImplications: readout.strategicImplications.slice(0, 2),
      opportunitySummary: node.opportunity,
    };
  });
}
