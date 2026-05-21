"use client";

import { CompetitorSuggestionPanel } from "@/components/CompetitorSuggestionPanel";
import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { KnowledgeRegistryPanel } from "@/components/KnowledgeRegistryPanel";
import { RetailerOverviewPanel } from "@/components/panels/RetailerOverviewPanel";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import type {
  RetailerEnrichmentBundle,
  RetailerEnrichmentOverrides,
} from "@/types/retailer-context";
import type { CompetitorEntry } from "@/types/competitors";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type {
  PricingPosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";
import type { RetailerFormat } from "@/types/ui";
import { getArchetype } from "@/lib/archetypeContext";

type RetailerContextPanelProps = {
  retailerName: string;
  retailerFormat: RetailerFormat;
  knowledgeContext: KnowledgeRegistryContext;
  archetypeId: RetailerArchetypeId;
  knowledgePosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  retailerEnrichment: RetailerEnrichmentBundle;
  manualTicker: string;
  enrichmentLoading: boolean;
  onRetailerNameChange: (value: string) => void;
  onConfirmRetailer: () => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onArchetypeChange: (id: RetailerArchetypeId) => void;
  onKnowledgePostureChange: (posture: PricingPosture) => void;
  onToggleObjective: (id: StrategicObjectiveId) => void;
  onCategoryHintChange: (value: string) => void;
  onManualTickerChange: (value: string) => void;
  onEnrichmentOverrides: (overrides: RetailerEnrichmentOverrides) => void;
  onRefreshEnrichment: () => void;
  onApplySuggestedSetup?: () => void;
  competitors: CompetitorEntry[];
  onCompetitorsChange: (competitors: CompetitorEntry[]) => void;
};

export function RetailerContextPanel({
  retailerName,
  retailerFormat,
  archetypeId,
  knowledgePosture,
  strategicObjectives,
  categoryHint,
  retailerEnrichment,
  manualTicker,
  enrichmentLoading,
  onRetailerNameChange,
  onConfirmRetailer,
  onRetailerFormatChange,
  onArchetypeChange,
  onKnowledgePostureChange,
  onToggleObjective,
  onCategoryHintChange,
  onManualTickerChange,
  onEnrichmentOverrides,
  onRefreshEnrichment,
  onApplySuggestedSetup,
  competitors,
  onCompetitorsChange,
}: RetailerContextPanelProps) {
  const archetype = getArchetype(archetypeId);
  const hasProfile = Boolean(retailerEnrichment.context.retailerName);

  return (
    <div className="max-w-3xl space-y-10 pilot-panel">
      <DiagnosticSection
        eyebrow="Step 1"
        title="Who are we assessing?"
        lead="Enter a retailer name. We enrich the profile and infer pricing posture, category structure, and strategic focus — you only refine what matters."
      >
        <RetailerInputCard
          retailerName={retailerName}
          onRetailerNameChange={onRetailerNameChange}
          onPopulate={onConfirmRetailer}
        />
      </DiagnosticSection>

      {hasProfile && (
        <>
          <div className="retailer-profile-summary rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Retailer pricing profile
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--text-navy)]">
              {retailerEnrichment.context.retailerName}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {archetype?.archetypeName ?? archetypeId} · {knowledgePosture} posture ·{" "}
              {categoryHint}
            </p>
            {retailerEnrichment.context.companyOverview && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-navy)]">
                {retailerEnrichment.context.companyOverview}
              </p>
            )}
            {(retailerEnrichment.suggestions.suggestedArchetypeId ||
              retailerEnrichment.suggestions.suggestedPosture) &&
              onApplySuggestedSetup && (
                <button
                  type="button"
                  onClick={onApplySuggestedSetup}
                  className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Apply suggested profile updates
                </button>
              )}
          </div>

          <RetailerOverviewPanel
            enrichment={retailerEnrichment}
            manualTicker={manualTicker}
            onManualTickerChange={onManualTickerChange}
            onOverridesChange={onEnrichmentOverrides}
            onRefresh={onRefreshEnrichment}
            isRefreshing={enrichmentLoading}
            embedded
          />
        </>
      )}

      <Disclosure
        title="Adjust assumptions (optional)"
        variant="subtle"
        defaultOpen={!hasProfile}
      >
        <div className="space-y-6">
          <KnowledgeRegistryPanel
            archetypeId={archetypeId}
            pricingPosture={knowledgePosture}
            strategicObjectives={strategicObjectives}
            categoryHint={categoryHint}
            onArchetypeChange={onArchetypeChange}
            onPostureChange={onKnowledgePostureChange}
            onToggleObjective={onToggleObjective}
            onCategoryHintChange={onCategoryHintChange}
            compact
          />
          <label className="block text-sm">
            <span className="font-medium text-[var(--text-navy)]">Format</span>
            <select
              value={retailerFormat}
              onChange={(e) =>
                onRetailerFormatChange(e.target.value as RetailerFormat)
              }
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
            >
              {["Grocery", "Mass", "Specialty", "Convenience", "Drug", "Club", "Other"].map(
                (f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
      </Disclosure>

      <Disclosure
        title="Market context — peers (optional)"
        variant="subtle"
      >
        <CompetitorSuggestionPanel
          competitors={competitors}
          onCompetitorsChange={onCompetitorsChange}
        />
      </Disclosure>
    </div>
  );
}
