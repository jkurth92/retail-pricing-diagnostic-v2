import type { CalculationStatus } from "@/types/diagnostic-output";

export type MetricCard = {
  label: string;
  value: number | null;
  displayValue: string;
  sourceStatus: string;
};

export type PeerComparisonRow = {
  metric: string;
  companyValue: number | null;
  companyDisplay: string;
  peerMedianValue: number | null;
  peerMedianDisplay: string;
  benchmarkSource: string;
};

export type NewsPlaceholderRow = {
  id: string;
  headline: string;
  status: string;
};

export type RetailerOverviewOutput = {
  retailerName: string;
  ticker: string;
  dataStatus: string;
  selectedPeerCount: number;
  sourceStatus: string;
  financialMetrics: MetricCard[];
  peerComparisonRows: PeerComparisonRow[];
  selectedPeerNames: string[];
  insightsStatus: string;
  newsRows: NewsPlaceholderRow[];
  integrationStatus: CalculationStatus;
};
