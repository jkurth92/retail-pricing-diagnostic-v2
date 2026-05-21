"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createEmptyEnrichment,
  fetchEnrichmentBundle,
  mergeEnrichmentOverrides,
} from "@/lib/api/contextResolver";
import type { RetailerEnrichmentOverrides } from "@/types/retailer-context";
import { AppShell } from "@/components/AppShell";
import { HeaderSummary } from "@/components/HeaderSummary";
import { JourneyStepper } from "@/components/JourneyStepper";
import { PilotWalkthroughBanner } from "@/components/PilotWalkthroughBanner";
import { RetailerContextPanel } from "@/components/panels/RetailerContextPanel";
import { UploadScopePanel } from "@/components/panels/UploadScopePanel";
import { PricingDiagnosticPanel } from "@/components/panels/PricingDiagnosticPanel";
import { OpportunityOverviewPanel } from "@/components/panels/OpportunityOverviewPanel";
import { ExportDeliverablesPanel } from "@/components/panels/ExportDeliverablesPanel";
import { createSuggestedCompetitors } from "@/lib/competitors";
import { formatToArchetypeId } from "@/lib/archetypeContext";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { runDiagnosticHypothesisEngine } from "@/lib/hypothesisEngine";
import { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import { runOpportunityStorylineEngine } from "@/lib/storylineSynthesizer";
import {
  EMPTY_EXPORT_BUNDLE,
  EMPTY_EXPORT_PACKAGE,
  EMPTY_HYPOTHESIS_OUTPUT,
  EMPTY_READOUT,
  EMPTY_STORYLINE_EXPORT,
  EMPTY_STORYLINE_RESULT,
} from "@/lib/pilotEmptyOutputs";
import { parseNumericInput } from "@/lib/scopeMath";
import { PILOT_DEMO_PRESET } from "@/data/pilotDemo";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type {
  PricingPosture as KnowledgePosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";
import type { CompetitorEntry } from "@/types/competitors";
import type { LeverKey } from "@/types/diagnostic-output";
import {
  DEFAULT_EPR_SCORES,
  DEFAULT_SELECTED_LEVER_KEYS,
  WORKFLOW_TABS,
  workflowTabToSidebarStep,
  type EprScores,
  type RetailerFormat,
  type WorkflowTab,
} from "@/types/ui";

export default function Home() {
  const [workflowTab, setWorkflowTab] =
    useState<WorkflowTab>("retailer_context");
  const [diagnosticReady, setDiagnosticReady] = useState(false);
  const [pilotDemoActive, setPilotDemoActive] = useState(false);
  const [retailerInput, setRetailerInput] = useState("");
  const [confirmedRetailer, setConfirmedRetailer] = useState("");
  const [eprScores, setEprScores] = useState<EprScores>(DEFAULT_EPR_SCORES);
  const [retailerFormat, setRetailerFormat] =
    useState<RetailerFormat>("Mass");
  const [strategicContext, setStrategicContext] = useState("");
  const [archetypeId, setArchetypeId] = useState<RetailerArchetypeId>("mass");
  const [knowledgePosture, setKnowledgePosture] =
    useState<KnowledgePosture>("EDLP");
  const [strategicObjectives, setStrategicObjectives] = useState<
    StrategicObjectiveId[]
  >(["value_perception", "traffic_growth"]);
  const [categoryHint, setCategoryHint] = useState("Laundry detergent");
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [totalRevenueInput, setTotalRevenueInput] = useState("");
  const [addressablePercentInput, setAddressablePercentInput] = useState("");
  const [revenueInScopeInput, setRevenueInScopeInput] = useState("");
  const [includedCategories, setIncludedCategories] = useState<string[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [selectedLeverKeys, setSelectedLeverKeys] = useState<Set<LeverKey>>(
    () => new Set(DEFAULT_SELECTED_LEVER_KEYS),
  );
  const [retailerEnrichment, setRetailerEnrichment] = useState(() =>
    createEmptyEnrichment(),
  );
  const [manualTicker, setManualTicker] = useState("");
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  const retailerDisplay = confirmedRetailer.trim() || "Not selected";
  const selectedPeerCount = competitors.filter(
    (c) => c.selectedForPeerView,
  ).length;

  const knowledgeContext = useMemo(
    () => ({
      archetypeId,
      pricingPosture: knowledgePosture,
      strategicObjectives,
      categoryHint,
    }),
    [archetypeId, knowledgePosture, strategicObjectives, categoryHint],
  );

  const ingestionPreview = useMemo(
    () => buildPlaceholderIngestionDataset(),
    [],
  );

  const hypothesisOutput = useMemo(() => {
    if (!diagnosticReady) return EMPTY_HYPOTHESIS_OUTPUT;
    return runDiagnosticHypothesisEngine({
      knowledge: knowledgeContext,
      normalizedFields: ingestionPreview.normalizedFields,
      leverUnlocks: ingestionPreview.leverUnlocks,
      eprScores,
    });
  }, [diagnosticReady, knowledgeContext, ingestionPreview, eprScores]);

  const hasRevenueInScope = parseNumericInput(revenueInScopeInput) !== null;

  const storylineResult = useMemo(() => {
    if (!diagnosticReady) return EMPTY_STORYLINE_RESULT;
    return runOpportunityStorylineEngine({
      hypothesisOutput,
      knowledge: knowledgeContext,
      retailerDisplayName: confirmedRetailer || retailerInput,
      hasRevenueInScope,
    });
  }, [
    diagnosticReady,
    hypothesisOutput,
    knowledgeContext,
    confirmedRetailer,
    retailerInput,
    hasRevenueInScope,
  ]);

  const executiveDeliverable = useMemo(() => {
    if (!diagnosticReady) {
      return {
        ...EMPTY_READOUT,
        exportPackage: EMPTY_EXPORT_PACKAGE,
        exportBundle: EMPTY_EXPORT_BUNDLE,
        storylineExport: EMPTY_STORYLINE_EXPORT,
      };
    }
    return runExecutiveDeliverableEngine({
      knowledge: knowledgeContext,
      storylineResult,
      eprScores,
      retailerDisplayName: confirmedRetailer || retailerInput,
      strategicContext,
      enrichment: retailerEnrichment,
    });
  }, [
    diagnosticReady,
    knowledgeContext,
    storylineResult,
    eprScores,
    confirmedRetailer,
    retailerInput,
    strategicContext,
    retailerEnrichment,
  ]);

  const canRunDiagnostic = Boolean(confirmedRetailer.trim());
  const runDisabledReason = canRunDiagnostic
    ? undefined
    : "Confirm a retailer name before generating the diagnostic.";

  const refreshEnrichment = useCallback(
    async (
      name: string,
      tickerOverride?: string,
      overrides?: RetailerEnrichmentOverrides,
    ) => {
      if (!name.trim()) {
        setRetailerEnrichment(createEmptyEnrichment());
        return;
      }
      setEnrichmentLoading(true);
      try {
        const bundle = await fetchEnrichmentBundle(
          name.trim(),
          (tickerOverride ?? manualTicker) || null,
          overrides ?? retailerEnrichment.manualOverrides,
        );
        setRetailerEnrichment(bundle);
        if (bundle.context.ticker && !manualTicker) {
          setManualTicker(bundle.context.ticker);
        }
      } finally {
        setEnrichmentLoading(false);
      }
    },
    [manualTicker, retailerEnrichment.manualOverrides],
  );

  const handleEnrichmentOverrides = (overrides: RetailerEnrichmentOverrides) => {
    setRetailerEnrichment((prev) =>
      mergeEnrichmentOverrides(prev, overrides, manualTicker),
    );
  };

  const handleConfirmRetailer = () => {
    const trimmed = retailerInput.trim();
    setConfirmedRetailer(trimmed || "");
    setCompetitors(createSuggestedCompetitors(retailerFormat));
    setArchetypeId(formatToArchetypeId(retailerFormat));
    void refreshEnrichment(trimmed);
  };

  const handleRetailerFormatChange = (format: RetailerFormat) => {
    setRetailerFormat(format);
    setArchetypeId(formatToArchetypeId(format));
  };

  const toggleStrategicObjective = (id: StrategicObjectiveId) => {
    setStrategicObjectives((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const toggleIncludedCategory = (category: string) => {
    setIncludedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setExcludedCategories((prev) => prev.filter((c) => c !== category));
  };

  const toggleExcludedCategory = (category: string) => {
    setExcludedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setIncludedCategories((prev) => prev.filter((c) => c !== category));
  };

  const toggleLever = (leverKey: LeverKey) => {
    setSelectedLeverKeys((prev) => {
      const next = new Set(prev);
      if (next.has(leverKey)) {
        next.delete(leverKey);
      } else {
        next.add(leverKey);
      }
      return next;
    });
  };

  const handleRunDiagnostic = () => {
    setDiagnosticReady(true);
    setWorkflowTab("pricing_diagnostic");
  };

  const handleStartPilotDemo = () => {
    const preset = PILOT_DEMO_PRESET;
    setPilotDemoActive(true);
    setDiagnosticReady(false);
    setRetailerInput(preset.retailerName);
    setConfirmedRetailer(preset.retailerName);
    setRetailerFormat(preset.retailerFormat);
    setArchetypeId(preset.archetypeId);
    setKnowledgePosture(preset.knowledgePosture);
    setStrategicObjectives(preset.strategicObjectives);
    setCategoryHint(preset.categoryHint);
    setStrategicContext(preset.strategicContext);
    setTotalRevenueInput(preset.totalRevenueInput);
    setAddressablePercentInput(preset.addressablePercentInput);
    setRevenueInScopeInput(preset.revenueInScopeInput);
    setIncludedCategories(preset.includedCategories);
    setExcludedCategories([]);
    setCompetitors(createSuggestedCompetitors(preset.retailerFormat));
    setWorkflowTab("retailer_context");
    void refreshEnrichment(preset.retailerName);
  };

  const workflowStepLabel = useMemo(() => {
    const tab = WORKFLOW_TABS.find((t) => t.id === workflowTab);
    return tab?.label ?? "Workflow";
  }, [workflowTab]);

  const marginOpportunityRange = diagnosticReady
    ? storylineResult.storyline.marginOpportunityTotalRange
    : undefined;

  const renderWorkflowPanel = () => {
    switch (workflowTab) {
      case "retailer_context":
        return (
          <RetailerContextPanel
            retailerName={retailerInput}
            retailerFormat={retailerFormat}
            knowledgeContext={knowledgeContext}
            archetypeId={archetypeId}
            knowledgePosture={knowledgePosture}
            strategicObjectives={strategicObjectives}
            categoryHint={categoryHint}
            retailerEnrichment={retailerEnrichment}
            manualTicker={manualTicker}
            enrichmentLoading={enrichmentLoading}
            onRetailerNameChange={setRetailerInput}
            onConfirmRetailer={handleConfirmRetailer}
            onRetailerFormatChange={handleRetailerFormatChange}
            onArchetypeChange={setArchetypeId}
            onKnowledgePostureChange={setKnowledgePosture}
            onToggleObjective={toggleStrategicObjective}
            onCategoryHintChange={setCategoryHint}
            onManualTickerChange={setManualTicker}
            onEnrichmentOverrides={handleEnrichmentOverrides}
            onRefreshEnrichment={() =>
              refreshEnrichment(confirmedRetailer || retailerInput)
            }
            onApplySuggestedSetup={() => {
              const s = retailerEnrichment.suggestions;
              if (s.suggestedArchetypeId) setArchetypeId(s.suggestedArchetypeId);
              if (s.suggestedPosture) setKnowledgePosture(s.suggestedPosture);
            }}
            competitors={competitors}
            onCompetitorsChange={setCompetitors}
          />
        );
      case "upload_scope":
        return (
          <UploadScopePanel
            knowledgeContext={knowledgeContext}
            retailerName={confirmedRetailer}
            selectedPeerCount={selectedPeerCount}
            totalRevenueInput={totalRevenueInput}
            addressablePercentInput={addressablePercentInput}
            revenueInScopeInput={revenueInScopeInput}
            includedCategories={includedCategories}
            excludedCategories={excludedCategories}
            selectedLeverKeys={selectedLeverKeys}
            onTotalRevenueChange={setTotalRevenueInput}
            onAddressablePercentChange={setAddressablePercentInput}
            onRevenueInScopeChange={setRevenueInScopeInput}
            onToggleIncludedCategory={toggleIncludedCategory}
            onToggleExcludedCategory={toggleExcludedCategory}
            onToggleLever={toggleLever}
            onRunDiagnostic={handleRunDiagnostic}
            canRunDiagnostic={canRunDiagnostic}
            runDisabledReason={runDisabledReason}
          />
        );
      case "pricing_diagnostic":
        return (
          <PricingDiagnosticPanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
            eprScores={eprScores}
            diagnosticReady={diagnosticReady}
            onRunDiagnostic={handleRunDiagnostic}
            canRunDiagnostic={canRunDiagnostic}
            runDisabledReason={runDisabledReason}
          />
        );
      case "opportunity_overview":
        return (
          <OpportunityOverviewPanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
            diagnosticReady={diagnosticReady}
            onRunDiagnostic={handleRunDiagnostic}
            canRunDiagnostic={canRunDiagnostic}
          />
        );
      case "executive_outputs":
        return (
          <ExportDeliverablesPanel
            knowledgeContext={knowledgeContext}
            exportBundle={executiveDeliverable.exportBundle}
            storylineExport={executiveDeliverable.storylineExport}
            diagnosticReady={diagnosticReady}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell
      activeStep={workflowTabToSidebarStep(workflowTab)}
      onNavigate={setWorkflowTab}
    >
      <PilotWalkthroughBanner
        onStartDemo={handleStartPilotDemo}
        demoActive={pilotDemoActive}
      />
      <HeaderSummary
        retailerDisplay={retailerDisplay}
        knowledgeContext={knowledgeContext}
        workflowStepLabel={workflowStepLabel}
        marginOpportunityRange={marginOpportunityRange}
        diagnosticReady={diagnosticReady}
      />
      <JourneyStepper active={workflowTab} onChange={setWorkflowTab} />
      {renderWorkflowPanel()}
    </AppShell>
  );
}
