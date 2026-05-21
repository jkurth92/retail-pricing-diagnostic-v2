import {
  DEFAULT_LEADERSHIP_QUESTIONS,
  MEMO_COHERENCE_LABELS,
  MEMO_FOOTER_NOTE,
  MEMO_TITLE_PREFIX,
} from "@/data/export/memoTemplates";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExecutiveMemo } from "@/types/executive-memo";

function coherenceAssessment(readout: DiagnosticReadout): string {
  const arch = readout.executiveSummary.topThemes.find((t) =>
    t.themeName.toLowerCase().includes("architecture"),
  );
  if (arch && arch.rank <= 2) return MEMO_COHERENCE_LABELS.mixed;
  if (readout.executiveSummary.topThemes.length <= 2)
    return MEMO_COHERENCE_LABELS.strong;
  return MEMO_COHERENCE_LABELS.constrained;
}

export function buildExecutiveMemo(
  readout: DiagnosticReadout,
  retailerName: string,
): ExecutiveMemo {
  const opp = readout.opportunityDetail;
  const byLever = [
    ...opp.primaryOpportunityDrivers,
    ...opp.secondaryOpportunityDrivers,
  ]
    .slice(0, 5)
    .map((d) => ({ leverLabel: d.label, marginRange: d.marginRange }));

  const synthesis =
    readout.executiveSummary.executiveNarrative.split(".").slice(0, 2).join(".") +
    ".";

  const structuralThemes = readout.storylineSections
    .filter((s) =>
      ["architecture_coherence", "kvi_role_alignment", "promo_markdown_structure"].includes(
        s.id,
      ),
    )
    .map((s) => s.sectionNarrative.split(".").slice(0, 1).join(".") + ".")
    .slice(0, 4);

  const leadershipFocusAreas = [
    ...readout.executiveSummary.nextFocusAreas.slice(0, 2),
    ...DEFAULT_LEADERSHIP_QUESTIONS,
  ].slice(0, 4);

  const executiveAnswer = [
    `Potential pricing opportunity: ${opp.totalMarginOpportunityRange || "directional — thematic bands only"}`,
    "",
    "Primary drivers:",
    ...byLever.map((l) => `• ${l.leverLabel}: ${l.marginRange}`),
    "",
    synthesis,
    "",
    `Pricing coherence: ${coherenceAssessment(readout)}`,
  ].join("\n");

  return {
    title: `${MEMO_TITLE_PREFIX} — ${retailerName || "Client"}`,
    executiveAnswer,
    opportunityBreakdown: {
      totalRange: opp.totalMarginOpportunityRange,
      byLever,
      synthesis,
    },
    structuralThemes:
      structuralThemes.length > 0
        ? structuralThemes
        : readout.strategicImplications.slice(0, 3),
    leadershipFocusAreas,
    supportingNarrative: readout.opportunityOverview.split(".").slice(0, 2).join(".") + ".",
    notes: [MEMO_FOOTER_NOTE, readout.guardrailMessage],
  };
}
