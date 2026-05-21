import type { ExecutiveEmail } from "@/types/executive-email";
import type { ExecutiveMemo } from "@/types/executive-memo";
import type { PresentationExport } from "@/types/presentation-export";

export type ExportSection = {
  sectionTitle: string;
  summary: string;
  supportingEvidence: string[];
  strategicImplications: string[];
  opportunitySummary: string;
};

export type ExportFormatKind = "email" | "memo_docx" | "pptx" | "storyline_json";

export type ExportSectionSelection = {
  sectionId: string;
  included: boolean;
  /** Future: consultant-edited overrides */
  overrides?: Partial<Pick<ExportSection, "summary" | "sectionTitle">>;
};

export type ExportDeliverableBundle = {
  id: string;
  retailerName: string;
  generatedAt: string;
  status: "draft" | "ready";
  guardrailNote: string;
  email: ExecutiveEmail;
  memo: ExecutiveMemo;
  presentation: PresentationExport;
  sections: ExportSection[];
  sectionSelections: ExportSectionSelection[];
  storylineExportId: string;
};

export type ExportModularityConfig = {
  includeEmail: boolean;
  includeMemo: boolean;
  includePresentation: boolean;
  slideIds: string[];
  sectionIds: string[];
};

export const DEFAULT_EXPORT_MODULARITY: ExportModularityConfig = {
  includeEmail: true,
  includeMemo: true,
  includePresentation: true,
  slideIds: ["executive_summary", "architecture_deep_dive", "supporting_themes"],
  sectionIds: [],
};
