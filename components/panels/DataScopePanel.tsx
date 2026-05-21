"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import { ClientUploadsPanel } from "@/components/panels/ClientUploadsPanel";
import { ScopePanel } from "@/components/panels/ScopePanel";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { LeverKey } from "@/types/diagnostic-output";

type DataScopePanelProps = {
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
};

export function DataScopePanel(props: DataScopePanelProps) {
  return (
    <div className="max-w-4xl space-y-10">
      <JourneyContextStrip context={props.knowledgeContext} stepLabel="Data & scope" />

      <DiagnosticSection
        eyebrow="Diagnostic scope"
        title="Data readiness and revenue in scope"
        lead="Define what data is available and which revenue base future sizing would reference. Thematic opportunity ranges do not require dollars in this build."
      >
        <ScopePanel {...props} embedded />
      </DiagnosticSection>

      <DiagnosticSection
        eyebrow="Client data"
        title="Upload readiness"
        lead="Placeholder preview until live file ingestion is aligned."
      >
        <ClientUploadsPanel
          knowledgeContext={props.knowledgeContext}
          embedded
        />
      </DiagnosticSection>

      <Disclosure
        title="View peer context (optional)"
        summary="Suggested competitors for market framing only — not used in opportunity sizing"
        variant="subtle"
      >
        <p className="text-sm text-[var(--text-muted)]">
          Configure peers on Client context if needed for retailer overview notes.
          Peer count in scope: {props.selectedPeerCount}
        </p>
      </Disclosure>
    </div>
  );
}
