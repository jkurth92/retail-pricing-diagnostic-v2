export type PresentationSlide = {
  id: string;
  slideTitle: string;
  headline: string;
  bodyBullets: string[];
  evidenceBullets: string[];
  rhsCallout: string;
  opportunityLine?: string;
  includeInDefaultExport: boolean;
};

export type PresentationExport = {
  presentationTitle: string;
  executiveSummarySlide: PresentationSlide;
  opportunityOverviewSlide: PresentationSlide;
  deepDiveSlides: PresentationSlide[];
  supportingThemes: PresentationSlide[];
  appendixSections: PresentationSlide[];
};
