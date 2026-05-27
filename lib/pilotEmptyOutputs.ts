import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { StorylineExportTree } from "@/lib/export/storylineExport";
import type { ExportPackage } from "@/types/export-structure";

export const EMPTY_HYPOTHESIS_OUTPUT: DiagnosticHypothesisOutput = {
  generatedAt: "",
  engineVersion: "pilot-idle",
  guardrailMessage:
    "Run the strategic pricing assessment to generate structural themes and opportunity framing.",
  hypotheses: [],
  suppressedCount: 0,
  architectureFirstNote: "",
};

export const EMPTY_STORYLINE_RESULT: StorylineSynthesisResult = {
  storyline: {
    id: "idle",
    title: "Assessment not yet run",
    executiveSummary:
      "Confirm retailer context and data scope, then generate the pricing diagnostic.",
    primaryThemes: [],
    secondaryThemes: [],
    marginOpportunityTotalRange: "—",
    revenueSensitivitySummary: "—",
    confidenceSummary: "",
    narrative: "",
    notes: [],
  },
  allThemesBuilt: 0,
  suppressedThemeCount: 0,
  opportunity: {
    status: "insufficient_hypotheses",
    totalMarginOpportunityRange: "—",
    totalRevenueSensitivityRange: "—",
    primaryOpportunityDrivers: [],
    secondaryOpportunityDrivers: [],
    caveats: [],
    notes: [],
  },
};

export const EMPTY_READOUT: DiagnosticReadout = {
  engineVersion: "pilot-idle",
  generatedAt: "",
  guardrailMessage: EMPTY_HYPOTHESIS_OUTPUT.guardrailMessage,
  executiveSummary: {
    id: "idle",
    retailerProfile: {
      archetype: "—",
      posture: "—",
      inferredCategoryRoleStructure: "—",
      inferredItemRoleStructure: "—",
      architectureProfile: "—",
      maturityProfile: "—",
      strategicOrientation: "—",
      notes: [],
    },
    pricingPosture: "—",
    executiveNarrative: EMPTY_STORYLINE_RESULT.storyline.executiveSummary,
    topThemes: [],
    marginOpportunitySummary: "—",
    revenueSensitivitySummary: "—",
    confidenceSummary: "—",
    maturitySummary: "—",
    strategicImplications: [],
    nextFocusAreas: [],
    opportunityHeadline: "—",
    primaryDrivers: [],
    evidenceBackedThemes: [],
    supportingEvidenceMetrics: [],
    strategicImplicationOneLiner: "—",
    evidenceStrength: "weak",
    exposureSummaries: [],
    causalFramingLines: [],
  },
  storylineSections: [],
  opportunityOverview: "",
  opportunityDetail: EMPTY_STORYLINE_RESULT.opportunity,
  strategicImplications: [],
  supportingThemes: [],
  notes: [],
};

export const EMPTY_EXPORT_BUNDLE: ExportDeliverableBundle = {
  id: "idle",
  retailerName: "Client",
  generatedAt: "",
  status: "draft",
  guardrailNote: "Generate the diagnostic before exporting deliverables.",
  email: {
    subject: "",
    greeting: "",
    executiveSummary: "",
    topThemes: [],
    opportunitySummary: "",
    nextStepFraming: "",
    closing: "",
  },
  memo: {
    title: "Executive memo",
    retailerContext: "",
    pricingObservations: "",
    implications: "",
    discussionQuestions: [],
    notes: [],
  },
  presentation: {
    presentationTitle: "Pricing diagnostic",
    executiveSummarySlide: {
      id: "idle",
      slideTitle: "",
      headline: "",
      bodyBullets: [],
      evidenceBullets: [],
      rhsCallout: "",
      includeInDefaultExport: false,
    },
    opportunityOverviewSlide: {
      id: "idle",
      slideTitle: "",
      headline: "",
      bodyBullets: [],
      evidenceBullets: [],
      rhsCallout: "",
      includeInDefaultExport: false,
    },
    deepDiveSlides: [],
    supportingThemes: [],
    appendixSections: [],
  },
  sections: [],
  sectionSelections: [],
  storylineExportId: "idle",
};

export const EMPTY_STORYLINE_EXPORT: StorylineExportTree = {
  id: "idle",
  retailerName: "Client",
  generatedAt: "",
  nodes: [],
};

export const EMPTY_EXPORT_PACKAGE: ExportPackage = {
  id: "idle",
  title: "Pricing diagnostic",
  retailerName: "Client",
  generatedAt: "",
  format: "memo_doc",
  status: "scaffold_only",
  executiveSummaryBlock: {
    id: "idle",
    title: "Executive summary",
    narrative: "",
    bulletPoints: [],
    includeOpportunity: false,
  },
  storylineBlocks: [],
  opportunityBlock: {
    id: "idle",
    title: "Opportunity",
    narrative: "",
    bulletPoints: [],
    includeOpportunity: true,
  },
  implicationsBlock: {
    id: "idle",
    title: "Implications",
    narrative: "",
    bulletPoints: [],
    includeOpportunity: false,
  },
  footerNotes: [],
};
