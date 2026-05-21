"use client";

import { DiagnosticSection } from "@/components/DiagnosticSection";
import { RunDiagnosticCta } from "@/components/RunDiagnosticCta";
import { SimplifiedUploadPanel } from "@/components/SimplifiedUploadPanel";
import { ScopePanel } from "@/components/panels/ScopePanel";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { LeverKey } from "@/types/diagnostic-output";

type UploadScopePanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  retailerName: string;
  selectedPeerCount: number;
  totalRevenueInput: string;
  addressablePercentInput: string;
  revenueInScopeInput: string;
  includedCategories: string[];
  excludedCategories: string[];
  selectedLeverKeys: Set<LeverKey>;
  onTotalRevenueChange: (value: string) => void;
  onAddressablePercentChange: (value: string) => void;
  onRevenueInScopeChange: (value: string) => void;
  onToggleIncludedCategory: (category: string) => void;
  onToggleExcludedCategory: (category: string) => void;
  onToggleLever: (leverKey: LeverKey) => void;
  onRunDiagnostic: () => void;
  canRunDiagnostic: boolean;
  runDisabledReason?: string;
};

export function UploadScopePanel({
  onRunDiagnostic,
  canRunDiagnostic,
  runDisabledReason,
  ...scopeProps
}: UploadScopePanelProps) {
  return (
    <div className="max-w-3xl space-y-10 pilot-panel">
      <DiagnosticSection
        eyebrow="Step 2"
        title="Upload & confirm scope"
        lead="Add one or two pricing files. We infer schema and readiness — then confirm categories and revenue in scope."
      >
        <SimplifiedUploadPanel maxFiles={2} />
      </DiagnosticSection>

      <DiagnosticSection
        title="Scope confirmation"
        lead="Refine what is in scope for this assessment. Opportunity framing stays directional until dollar formulas are aligned."
      >
        <ScopePanel {...scopeProps} embedded />
      </DiagnosticSection>

      <RunDiagnosticCta
        onRun={onRunDiagnostic}
        disabled={!canRunDiagnostic}
        disabledReason={runDisabledReason}
      />
    </div>
  );
}
