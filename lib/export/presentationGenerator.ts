import {
  APPENDIX_SLIDE_TITLE,
  ARCHITECTURE_SLIDE_TITLE,
  EXECUTIVE_SLIDE_TITLE,
  SLIDE_RHS_PREFIX,
  SUPPORTING_SLIDES_TITLE,
} from "@/data/export/slideTemplates";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type {
  PresentationExport,
  PresentationSlide,
} from "@/types/presentation-export";

function makeSlide(
  id: string,
  slideTitle: string,
  headline: string,
  bodyBullets: string[],
  evidenceBullets: string[],
  rhsCallout: string,
  opportunityLine?: string,
  include = true,
): PresentationSlide {
  return {
    id,
    slideTitle,
    headline,
    bodyBullets,
    evidenceBullets,
    rhsCallout,
    opportunityLine,
    includeInDefaultExport: include,
  };
}

export function buildPresentationExport(
  readout: DiagnosticReadout,
  retailerName: string,
): PresentationExport {
  const opp = readout.opportunityDetail;
  const leverLines = [
    ...opp.primaryOpportunityDrivers,
    ...opp.secondaryOpportunityDrivers,
  ]
    .slice(0, 4)
    .map((d) => `${d.label}: ${d.marginRange}`);

  const archSection = readout.storylineSections.find(
    (s) => s.id === "architecture_coherence",
  );
  const kviSection = readout.storylineSections.find(
    (s) => s.id === "kvi_role_alignment",
  );
  const promoSection = readout.storylineSections.find(
    (s) => s.id === "promo_markdown_structure",
  );
  const govSection = readout.storylineSections.find(
    (s) => s.id === "governance_maturity",
  );

  const topImplication =
    readout.strategicImplications[0] ??
    "Architecture coherence and value concentration appear to be the primary structural levers.";

  const executiveSummarySlide = makeSlide(
    "executive_summary",
    EXECUTIVE_SLIDE_TITLE,
    readout.executiveSummary.marginOpportunitySummary,
    [
      `Total margin opportunity (directional): ${opp.totalMarginOpportunityRange}`,
      ...leverLines,
      readout.executiveSummary.executiveNarrative.split(".").slice(0, 1).join(".") + ".",
    ],
    readout.executiveSummary.topThemes.slice(0, 3).map((t) => t.themeName),
    `${SLIDE_RHS_PREFIX}: ${topImplication}`,
    opp.totalMarginOpportunityRange,
  );

  const architectureSlide = makeSlide(
    "architecture_deep_dive",
    ARCHITECTURE_SLIDE_TITLE,
    archSection?.sectionTitle ?? "Price architecture & ladder structure",
    [
      archSection?.sectionNarrative ??
        readout.executiveSummary.retailerProfile.architectureProfile,
      "Premiumization / ladder structure should be validated against category role design.",
    ],
    archSection?.supportingThemes.map((t) => t.themeName) ?? [],
    `${SLIDE_RHS_PREFIX}: ${readout.strategicImplications[1] ?? topImplication}`,
  );

  const supportingThemes: PresentationSlide[] = [
    makeSlide(
      "kvi_efficiency",
      SUPPORTING_SLIDES_TITLE,
      "KVI & value investment concentration",
      [kviSection?.sectionNarrative ?? "KVI role alignment warrants leadership review."],
      kviSection?.supportingThemes.map((t) => t.themeName) ?? [],
      `${SLIDE_RHS_PREFIX}: Concentrate visible value where category roles have highest impact.`,
      kviSection?.opportunitySummary,
    ),
    makeSlide(
      "promotions_markdowns",
      SUPPORTING_SLIDES_TITLE,
      "Promotions & markdown structure",
      [promoSection?.sectionNarrative ?? "Promotional intensity should be tested against base-price architecture."],
      promoSection?.supportingThemes.map((t) => t.themeName) ?? [],
      `${SLIDE_RHS_PREFIX}: Assess whether promotions reinforce or replace architecture.`,
      promoSection?.opportunitySummary,
    ),
    makeSlide(
      "governance_maturity",
      SUPPORTING_SLIDES_TITLE,
      "Governance & maturity",
      [govSection?.sectionNarrative ?? "Governance signals suggest refinement opportunity without operational prescription."],
      govSection?.supportingThemes.map((t) => t.themeName) ?? [],
      `${SLIDE_RHS_PREFIX}: Maturity gaps are structural — not execution checklists.`,
      govSection?.opportunitySummary,
    ),
  ];

  const appendixSections: PresentationSlide[] = [];
  const profile = readout.executiveSummary.retailerProfile;
  if (
    profile.maturityProfile.toLowerCase().includes("markdown") ||
    profile.notes.some((n) => n.toLowerCase().includes("apparel"))
  ) {
    appendixSections.push(
      makeSlide(
        "retailer_specific",
        APPENDIX_SLIDE_TITLE,
        "Retailer-specific structural considerations",
        profile.notes.slice(0, 3),
        [],
        `${SLIDE_RHS_PREFIX}: Validate lifecycle, zoning, and governance themes with client leadership.`,
        undefined,
        false,
      ),
    );
  }

  return {
    presentationTitle: `Pricing Diagnostic — ${retailerName || "Client"}`,
    executiveSummarySlide,
    opportunityOverviewSlide: executiveSummarySlide,
    deepDiveSlides: [architectureSlide],
    supportingThemes,
    appendixSections,
  };
}

export function collectSlidesForExport(
  presentation: PresentationExport,
  slideIds?: string[],
): PresentationSlide[] {
  const all = [
    presentation.executiveSummarySlide,
    ...presentation.deepDiveSlides,
    ...presentation.supportingThemes,
    ...presentation.appendixSections,
  ];
  if (!slideIds || slideIds.length === 0) {
    return all.filter((s) => s.includeInDefaultExport);
  }
  return all.filter((s) => slideIds.includes(s.id));
}
