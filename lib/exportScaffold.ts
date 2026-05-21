import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportPackage, ExportSectionBlock } from "@/types/export-structure";

function toBlock(
  id: string,
  title: string,
  narrative: string,
  bullets: string[],
  includeOpportunity: boolean,
): ExportSectionBlock {
  return {
    id,
    title,
    narrative,
    bulletPoints: bullets,
    includeOpportunity,
  };
}

/** Scaffold only — PDF/PPT/memo generation not implemented. */
export function buildExportPackage(
  readout: DiagnosticReadout,
  retailerName: string,
  format: ExportPackage["format"] = "memo_doc",
): ExportPackage {
  const storylineBlocks = readout.storylineSections.map((s) =>
    toBlock(
      s.id,
      s.sectionTitle,
      s.sectionNarrative,
      s.supportingThemes.map((t) => t.themeName),
      s.id === "opportunity_framing",
    ),
  );

  return {
    id: `export-${readout.executiveSummary.id}`,
    title: `Pricing Diagnostic — ${retailerName || "Client"}`,
    retailerName: retailerName || "Client",
    generatedAt: readout.generatedAt,
    format,
    status: "scaffold_only",
    executiveSummaryBlock: toBlock(
      "executive-summary",
      "Executive summary",
      readout.executiveSummary.executiveNarrative,
      [
        readout.executiveSummary.marginOpportunitySummary,
        ...readout.executiveSummary.strategicImplications.slice(0, 3),
      ],
      true,
    ),
    storylineBlocks,
    opportunityBlock: toBlock(
      "opportunity",
      "Opportunity overview",
      readout.opportunityOverview,
      readout.opportunityDetail.primaryOpportunityDrivers.map(
        (d) => `${d.label}: ${d.marginRange}`,
      ),
      true,
    ),
    implicationsBlock: toBlock(
      "implications",
      "Strategic implications",
      readout.strategicImplications.join(" "),
      readout.strategicImplications,
      false,
    ),
    footerNotes: [
      "Export generation is scaffolded only in this build.",
      readout.guardrailMessage,
      ...readout.notes,
    ],
  };
}

export function exportReadinessLabel(pkg: ExportPackage): string {
  return pkg.status === "scaffold_only"
    ? "Export structure ready — generation pending alignment"
    : "Ready for export";
}
