"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HeaderSummary } from "@/components/HeaderSummary";
import { JourneyStepper } from "@/components/JourneyStepper";
import { ClientContextPanel } from "@/components/panels/ClientContextPanel";
import { DataScopePanel } from "@/components/panels/DataScopePanel";
import { PricingProfilePanel } from "@/components/panels/PricingProfilePanel";
import { StructuralThemesPanel } from "@/components/panels/StructuralThemesPanel";
import { OpportunityOverviewPanel } from "@/components/panels/OpportunityOverviewPanel";
import { StrategicImplicationsPanel } from "@/components/panels/StrategicImplicationsPanel";
import { SupportingDiagnosticsPanel } from "@/components/panels/SupportingDiagnosticsPanel";
import { createSuggestedCompetitors } from "@/lib/competitors";
import {
  formatToArchetypeId,
  legacyPostureToKnowledge,
} from "@/lib/archetypeContext";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { runDiagnosticHypothesisEngine } from "@/lib/hypothesisEngine";
import { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import { runOpportunityStorylineEngine } from "@/lib/storylineSynthesizer";
import { parseNumericInput } from "@/lib/scopeMath";
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
  type EprDimension,
  type EprScores,
  type PricingPosture,
  type RetailerFormat,
  type WorkflowTab,
} from "@/types/ui";

export default function Home() {
  const [workflowTab, setWorkflowTab] =
    useState<WorkflowTab>("client_context");
  const [retailerInput, setRetailerInput] = useState("");
  const [confirmedRetailer, setConfirmedRetailer] = useState("");
  const [eprScores, setEprScores] = useState<EprScores>(DEFAULT_EPR_SCORES);
  const [pricingPosture, setPricingPosture] =
    useState<PricingPosture>("Not sure");
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

  const hypothesisOutput = useMemo(
    () =>
      runDiagnosticHypothesisEngine({
        knowledge: knowledgeContext,
        normalizedFields: ingestionPreview.normalizedFields,
        leverUnlocks: ingestionPreview.leverUnlocks,
        eprScores,
      }),
    [knowledgeContext, ingestionPreview, eprScores],
  );

  const hasRevenueInScope = parseNumericInput(revenueInScopeInput) !== null;

  const storylineResult = useMemo(
    () =>
      runOpportunityStorylineEngine({
        hypothesisOutput,
        knowledge: knowledgeContext,
        retailerDisplayName: confirmedRetailer || retailerInput,
        hasRevenueInScope,
      }),
    [
      hypothesisOutput,
      knowledgeContext,
      confirmedRetailer,
      retailerInput,
      hasRevenueInScope,
    ],
  );

  const executiveDeliverable = useMemo(
    () =>
      runExecutiveDeliverableEngine({
        knowledge: knowledgeContext,
        storylineResult,
        eprScores,
        retailerDisplayName: confirmedRetailer || retailerInput,
        strategicContext,
      }),
    [
      knowledgeContext,
      storylineResult,
      eprScores,
      confirmedRetailer,
      retailerInput,
      strategicContext,
    ],
  );

  const handlePopulateRetailer = () => {
    const trimmed = retailerInput.trim();
    setConfirmedRetailer(trimmed || "");
    setCompetitors(createSuggestedCompetitors(retailerFormat));
    setArchetypeId(formatToArchetypeId(retailerFormat));
  };

  const handleRetailerFormatChange = (format: RetailerFormat) => {
    setRetailerFormat(format);
    setArchetypeId(formatToArchetypeId(format));
  };

  const handleLegacyPostureChange = (posture: PricingPosture) => {
    setPricingPosture(posture);
    setKnowledgePosture(legacyPostureToKnowledge(posture));
  };

  const toggleStrategicObjective = (id: StrategicObjectiveId) => {
    setStrategicObjectives((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const handleEprScoreChange = (dimension: EprDimension, score: number) => {
    setEprScores((prev) => ({ ...prev, [dimension]: score }));
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

  const workflowStepLabel = useMemo(() => {
    const tab = WORKFLOW_TABS.find((t) => t.id === workflowTab);
    return tab?.label ?? "Workflow";
  }, [workflowTab]);

  const renderWorkflowPanel = () => {
    switch (workflowTab) {
      case "client_context":
        return (
          <ClientContextPanel
            retailerName={retailerInput}
            pricingPosture={pricingPosture}
            retailerFormat={retailerFormat}
            strategicContext={strategicContext}
            competitors={competitors}
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
            archetypeId={archetypeId}
            knowledgePosture={knowledgePosture}
            strategicObjectives={strategicObjectives}
            categoryHint={categoryHint}
            onRetailerNameChange={setRetailerInput}
            onPopulateRetailer={handlePopulateRetailer}
            onPricingPostureChange={handleLegacyPostureChange}
            onRetailerFormatChange={handleRetailerFormatChange}
            onStrategicContextChange={setStrategicContext}
            onCompetitorsChange={setCompetitors}
            onArchetypeChange={setArchetypeId}
            onKnowledgePostureChange={setKnowledgePosture}
            onToggleObjective={toggleStrategicObjective}
            onCategoryHintChange={setCategoryHint}
          />
        );
      case "data_scope":
        return (
          <DataScopePanel
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
          />
        );
      case "pricing_profile":
        return (
          <PricingProfilePanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
            eprScores={eprScores}
            onEprScoreChange={handleEprScoreChange}
          />
        );
      case "structural_themes":
        return (
          <StructuralThemesPanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
            hypothesisOutput={hypothesisOutput}
          />
        );
      case "opportunity_overview":
        return (
          <OpportunityOverviewPanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
          />
        );
      case "strategic_implications":
        return (
          <StrategicImplicationsPanel
            knowledgeContext={knowledgeContext}
            executiveDeliverable={executiveDeliverable}
          />
        );
      case "supporting_diagnostics":
        return (
          <SupportingDiagnosticsPanel
            knowledgeContext={knowledgeContext}
            hypothesisOutput={hypothesisOutput}
            storylineResult={storylineResult}
            executiveDeliverable={executiveDeliverable}
            eprScores={eprScores}
            retailerName={confirmedRetailer}
            competitors={competitors}
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
      <HeaderSummary
        retailerDisplay={retailerDisplay}
        knowledgeContext={knowledgeContext}
        workflowStepLabel={workflowStepLabel}
        marginOpportunityRange={
          storylineResult.storyline.marginOpportunityTotalRange
        }
      />
      <JourneyStepper active={workflowTab} onChange={setWorkflowTab} />
      {renderWorkflowPanel()}
    </AppShell>
  );
}
