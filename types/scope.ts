import type { LeverKey } from "@/types/diagnostic-output";

export type CategoryScopeItem = {
  id: string;
  name: string;
  included: boolean;
  excluded: boolean;
  revenueIfKnown: string;
  notes: string;
};

export type ScopeDefinitionStatus = "scope_defined" | "needs_inputs";

export type ScopeDefinition = {
  retailerName: string | null;
  totalRetailerRevenue: number | null;
  addressableRevenuePercentage: number | null;
  addressableRevenueValue: number | null;
  revenueInDiagnosticScope: number | null;
  categoriesIncluded: string[];
  categoriesExcluded: string[];
  categoryItems: CategoryScopeItem[];
  selectedLeverKeys: LeverKey[];
  selectedCompetitorCount: number;
  status: ScopeDefinitionStatus;
  scopeMathNote: string;
};
