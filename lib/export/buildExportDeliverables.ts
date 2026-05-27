import { buildExecutiveMemo, type BuildExecutiveMemoOptions } from "@/lib/export/executiveMemoGenerator";
import { buildPresentationExport } from "@/lib/export/presentationGenerator";
import {
  buildStorylineExportTree,
  storylineNodesToExportSections,
} from "@/lib/export/storylineExport";
import { buildExportPackage } from "@/lib/exportScaffold";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportPackage } from "@/types/export-structure";
import {
  DEFAULT_EXPORT_MODULARITY,
  type ExportDeliverableBundle,
  type ExportModularityConfig,
  type ExportSectionSelection,
} from "@/types/export-system";

export function buildExportDeliverableBundle(
  readout: DiagnosticReadout,
  retailerName: string,
  _modularity: ExportModularityConfig = DEFAULT_EXPORT_MODULARITY,
  memoOptions: BuildExecutiveMemoOptions = {},
): ExportDeliverableBundle {
  const storylineTree = buildStorylineExportTree(readout, retailerName);
  const sections = storylineNodesToExportSections(storylineTree, readout);
  const sectionSelections: ExportSectionSelection[] = sections.map((s, i) => ({
    sectionId: storylineTree.nodes[i]?.sectionId ?? `section-${i}`,
    included: true,
  }));

  return {
    id: `export-bundle-${readout.executiveSummary.id}`,
    retailerName: retailerName || "Client",
    generatedAt: readout.generatedAt,
    status: "ready",
    guardrailNote: readout.guardrailMessage,
    email: {
      subject: "",
      greeting: "",
      executiveSummary: "",
      topThemes: [],
      opportunitySummary: "",
      nextStepFraming: "",
      closing: "",
    },
    memo: buildExecutiveMemo(readout, retailerName, memoOptions),
    presentation: buildPresentationExport(readout, retailerName),
    sections,
    sectionSelections,
    storylineExportId: storylineTree.id,
  };
}

export function buildFullExportArtifacts(
  readout: DiagnosticReadout,
  retailerName: string,
  memoOptions: BuildExecutiveMemoOptions = {},
): {
  bundle: ExportDeliverableBundle;
  legacyPackage: ExportPackage;
  storylineTree: ReturnType<typeof buildStorylineExportTree>;
} {
  const bundle = buildExportDeliverableBundle(readout, retailerName, DEFAULT_EXPORT_MODULARITY, memoOptions);
  const legacyPackage = buildExportPackage(readout, retailerName, "memo_doc");
  const storylineTree = buildStorylineExportTree(readout, retailerName);
  return { bundle, legacyPackage, storylineTree };
}
