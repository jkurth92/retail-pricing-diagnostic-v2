import { buildExecutiveEmail } from "@/lib/export/executiveEmailGenerator";
import { buildExecutiveMemo } from "@/lib/export/executiveMemoGenerator";
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
    email: buildExecutiveEmail(readout, retailerName),
    memo: buildExecutiveMemo(readout, retailerName),
    presentation: buildPresentationExport(readout, retailerName),
    sections,
    sectionSelections,
    storylineExportId: storylineTree.id,
  };
}

export function buildFullExportArtifacts(
  readout: DiagnosticReadout,
  retailerName: string,
): {
  bundle: ExportDeliverableBundle;
  legacyPackage: ExportPackage;
  storylineTree: ReturnType<typeof buildStorylineExportTree>;
} {
  const bundle = buildExportDeliverableBundle(readout, retailerName);
  const legacyPackage = buildExportPackage(readout, retailerName, "memo_doc");
  const storylineTree = buildStorylineExportTree(readout, retailerName);
  return { bundle, legacyPackage, storylineTree };
}
