export type ExportFormat = "pdf" | "pptx" | "memo_doc" | "markdown";

export type ExportSectionBlock = {
  id: string;
  title: string;
  narrative: string;
  bulletPoints: string[];
  includeOpportunity: boolean;
};

export type ExportPackage = {
  id: string;
  title: string;
  retailerName: string;
  generatedAt: string;
  format: ExportFormat;
  status: "scaffold_only" | "ready_for_generation" | "ready";
  executiveSummaryBlock: ExportSectionBlock;
  storylineBlocks: ExportSectionBlock[];
  opportunityBlock: ExportSectionBlock;
  implicationsBlock: ExportSectionBlock;
  footerNotes: string[];
};
