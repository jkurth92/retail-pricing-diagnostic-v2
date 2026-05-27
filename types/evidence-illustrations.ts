import type { EvidenceMetricId } from "@/types/evidence-computation";

/** Representative commercial observation supporting an evidence metric (not prescriptive). */
export type IllustrativeCommercialExample = {
  category: string;
  observation: string;
  interpretation: string;
  granularity: "category" | "sku";
  /** Concrete SKU price lines shown under "Example:" (2+ per block when present). */
  skuLines?: string[];
};

export type EvidenceIllustrationMetricKey = EvidenceMetricId | "zoning_dispersion";

export type EvidenceIllustrationsBundle = {
  byMetricId: Partial<
    Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>
  >;
  disclaimer: string;
};
