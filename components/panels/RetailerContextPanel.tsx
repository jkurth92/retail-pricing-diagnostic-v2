"use client";

import { Disclosure } from "@/components/Disclosure";
import { RetailerContextEditor } from "@/components/RetailerContextEditor";
import { RetailerContextBrief } from "@/components/retailer-context/RetailerContextBrief";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import type {
  RetailerEnrichmentBundle,
  RetailerEnrichmentOverrides,
} from "@/types/retailer-context";
import type { FinancePeer } from "@/types/finance-peers";

type RetailerContextPanelProps = {
  retailerName: string;
  retailerEnrichment: RetailerEnrichmentBundle;
  manualTicker: string;
  enrichmentLoading: boolean;
  financePeers: FinancePeer[];
  onRetailerNameChange: (value: string) => void;
  onConfirmRetailer: () => void;
  onManualTickerChange: (value: string) => void;
  onEnrichmentOverrides: (overrides: RetailerEnrichmentOverrides) => void;
  onRefreshEnrichment: () => void;
  onFinancePeersChange: (peers: FinancePeer[]) => void;
  onAddFinancePeer: (name: string) => void;
  onGoToUploadScope: () => void;
};

export function RetailerContextPanel({
  retailerName,
  retailerEnrichment,
  manualTicker,
  enrichmentLoading,
  financePeers,
  onRetailerNameChange,
  onConfirmRetailer,
  onManualTickerChange,
  onEnrichmentOverrides,
  onRefreshEnrichment,
  onFinancePeersChange,
  onAddFinancePeer,
  onGoToUploadScope,
}: RetailerContextPanelProps) {
  const hasProfile = Boolean(retailerEnrichment.context.retailerName.trim());
  const canContinue = hasProfile && !enrichmentLoading;

  return (
    <div className="max-w-5xl space-y-8 pilot-panel">
      <div className="rc-step-intro">
        <h2 className="rc-step-title">Retailer context</h2>
        <p className="rc-step-lead">
          Enter a retailer to load public company context, financial benchmarks,
          and recent headlines. Pricing posture and category objectives are set
          on the next step.
        </p>
      </div>

      <RetailerInputCard
        retailerName={retailerName}
        onRetailerNameChange={onRetailerNameChange}
        onPopulate={onConfirmRetailer}
        loading={enrichmentLoading}
      />

      {(hasProfile || enrichmentLoading) && (
        <>
          <RetailerContextBrief
            enrichment={retailerEnrichment}
            loading={enrichmentLoading}
            financePeers={financePeers}
            onFinancePeersChange={onFinancePeersChange}
            onAddFinancePeer={onAddFinancePeer}
          />

          <Disclosure
            title="Edit company context fields"
            variant="subtle"
            defaultOpen={false}
          >
            <RetailerContextEditor
              enrichment={retailerEnrichment}
              manualTicker={manualTicker}
              onManualTickerChange={onManualTickerChange}
              onOverridesChange={onEnrichmentOverrides}
              onRefresh={onRefreshEnrichment}
              isRefreshing={enrichmentLoading}
            />
          </Disclosure>
        </>
      )}

      <div className="rc-primary-cta-row">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onGoToUploadScope}
          className="rc-primary-cta"
        >
          Next: refine scope of diagnostic
        </button>
        {!hasProfile && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Build a retailer profile to continue.
          </p>
        )}
      </div>
    </div>
  );
}
