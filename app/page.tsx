"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEmptyEnrichment,
  fetchEnrichmentBundle,
  mergeEnrichmentOverrides,
} from "@/lib/api/contextResolver";
import type { RetailerEnrichmentOverrides } from "@/types/retailer-context";
import { AppShell } from "@/components/AppShell";
import { HeaderSummary } from "@/components/HeaderSummary";
import { PilotWalkthroughBanner } from "@/components/PilotWalkthroughBanner";
import { RetailerContextPanel } from "@/components/panels/RetailerContextPanel";
import { UploadScopePanel } from "@/components/panels/UploadScopePanel";
import { PricingDiagnosticPanel } from "@/components/panels/PricingDiagnosticPanel";
import { ExportDeliverablesPanel } from "@/components/panels/ExportDeliverablesPanel";
import { createSuggestedCompetitors } from "@/lib/competitors";
import { refreshFinancePeerResolution } from "@/lib/financePeerResolution";
import {
  createUserFinancePeer,
  suggestFinancePeers,
} from "@/lib/financePeerSuggestion";
import type { FinancePeer } from "@/types/finance-peers";
import { formatToArchetypeId } from "@/lib/archetypeContext";
import { resolveRetailerArchetypeHint } from "@/lib/retailerArchetypeResolution";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { runEvidenceComputation } from "@/lib/evidenceComputation";
import { runOpportunityExposureEngine } from "@/lib/opportunityExposure";
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
import {
  calculateAddressableRevenue,
  parseNumericInput,
} from "@/lib/scopeMath";
import { PILOT_DEMO_PRESET } from "@/data/pilotDemo";
import { inferCategoryRoles } from "@/lib/inferCategoryRoles";
import { inferStrategicObjectives } from "@/lib/inferStrategicObjectives";
import {
  DEFAULT_ADDRESSABLE_PERCENT,
  formatRevenueInputValue,
  parseRevenueFromEnrichment,
} from "@/lib/scopeRevenue";
import type { InferredCategoryRow } from "@/types/category-scope";
import type {
  PricingPosture as KnowledgePosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";
import type { CompetitorEntry } from "@/types/competitors";
import {
  DEFAULT_EPR_SCORES,
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
  const [uploadFileNames, setUploadFileNames] = useState<string[]>([]);
  const [revenueFromProfile, setRevenueFromProfile] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [totalRevenueInput, setTotalRevenueInput] = useState("");
  const [addressablePercentInput, setAddressablePercentInput] = useState("");
  const [retailerEnrichment, setRetailerEnrichment] = useState(() =>
    createEmptyEnrichment(),
  );
  const [manualTicker, setManualTicker] = useState("");
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [financePeers, setFinancePeers] = useState<FinancePeer[]>([]);

  const categoryRolesInferred = useMemo(
    () =>
      inferCategoryRoles({
        archetypeId,
        retailerName: confirmedRetailer,
        ticker: retailerEnrichment.context.ticker,
        uploadedFileNames: uploadFileNames,
      }),
    [
      archetypeId,
      confirmedRetailer,
      retailerEnrichment.context.ticker,
      uploadFileNames,
    ],
  );

  const [categoryRolesEdited, setCategoryRolesEdited] =
    useState<InferredCategoryRow[] | null>(null);
  const categoryRolesKey = `${archetypeId}|${confirmedRetailer}|${retailerEnrichment.context.ticker}|${uploadFileNames.join(",")}`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset edits when retailer context changes
    setCategoryRolesEdited(null);
  }, [categoryRolesKey]);

  const categoryRoles = categoryRolesEdited ?? categoryRolesInferred;

  const retailerDisplay = confirmedRetailer.trim() || "Not selected";
  const knowledgeContext = useMemo(
    () => ({
      archetypeId,
      pricingPosture: knowledgePosture,
      strategicObjectives: inferStrategicObjectives(archetypeId, knowledgePosture),
      categoryHint:
        categoryRoles.find((r) => r.category.trim())?.category ?? "",
    }),
    [archetypeId, knowledgePosture, categoryRoles],
  );

  useEffect(() => {
    const parsed = parseRevenueFromEnrichment(retailerEnrichment);
    if (parsed != null && confirmedRetailer.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from Step 1 profile
      setTotalRevenueInput(formatRevenueInputValue(parsed));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from Step 1 profile
      setRevenueFromProfile(true);
      if (!addressablePercentInput.trim()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- default scope %
        setAddressablePercentInput(DEFAULT_ADDRESSABLE_PERCENT);
      }
    }
  }, [retailerEnrichment, confirmedRetailer, addressablePercentInput]);

  const revenueInScopeComputed = useMemo(() => {
    const total = parseNumericInput(totalRevenueInput);
    const pct = parseNumericInput(addressablePercentInput);
    return calculateAddressableRevenue(total, pct);
  }, [totalRevenueInput, addressablePercentInput]);

  const revenueInScopeInput = useMemo(
    () =>
      revenueInScopeComputed != null
        ? formatRevenueInputValue(revenueInScopeComputed)
        : "",
    [revenueInScopeComputed],
  );

  const ingestionPreview = useMemo(
    () =>
      buildPlaceholderIngestionDataset({
        categoryNames: categoryRoles.map((r) => r.category),
        archetypeId,
        retailerTicker: retailerEnrichment.context.ticker,
      }),
    [
      categoryRoles,
      archetypeId,
      retailerEnrichment.context.ticker,
    ],
  );

  const computedEvidence = useMemo(() => {
    if (!diagnosticReady) return null;
    const eprAvg =
      Object.values(eprScores).length > 0
        ? Object.values(eprScores).reduce((a, b) => a + b, 0) /
          Object.values(eprScores).length
        : null;
    return runEvidenceComputation({
      archetypeId,
      pricingPosture: knowledgePosture,
      categoryRows: categoryRoles,
      retailerTicker: retailerEnrichment.context.ticker,
      normalizedFields: ingestionPreview.normalizedFields,
      detectedColumns: ingestionPreview.detectedColumns,
      dataInterpretation: ingestionPreview.dataInterpretation,
      retailerDisplayName: confirmedRetailer || retailerInput,
      eprAverage: eprAvg,
    });
  }, [
    diagnosticReady,
    archetypeId,
    knowledgePosture,
    categoryRoles,
    retailerEnrichment.context.ticker,
    ingestionPreview.normalizedFields,
    confirmedRetailer,
    retailerInput,
    eprScores,
  ]);

  const opportunityExposure = useMemo(() => {
    if (!diagnosticReady || !computedEvidence) return null;
    return runOpportunityExposureEngine({
      archetypeId,
      pricingPosture: knowledgePosture,
      categoryRows: categoryRoles,
      retailerTicker: retailerEnrichment.context.ticker,
      normalizedFields: ingestionPreview.normalizedFields,
      retailerDisplayName: confirmedRetailer || retailerInput,
      evidence: computedEvidence,
      eprAverage: Object.values(eprScores).length
        ? Object.values(eprScores).reduce((a, b) => a + b, 0) /
          Object.values(eprScores).length
        : null,
    });
  }, [
    diagnosticReady,
    computedEvidence,
    archetypeId,
    knowledgePosture,
    categoryRoles,
    retailerEnrichment.context.ticker,
    ingestionPreview.normalizedFields,
    confirmedRetailer,
    retailerInput,
    eprScores,
  ]);

  const hypothesisOutput = useMemo(() => {
    if (!diagnosticReady) return EMPTY_HYPOTHESIS_OUTPUT;
    return runDiagnosticHypothesisEngine({
      knowledge: knowledgeContext,
      normalizedFields: ingestionPreview.normalizedFields,
      leverUnlocks: ingestionPreview.leverUnlocks,
      eprScores,
      evidenceInput: {
        archetypeId,
        pricingPosture: knowledgePosture,
        categoryRows: categoryRoles,
        retailerTicker: retailerEnrichment.context.ticker,
        normalizedFields: ingestionPreview.normalizedFields,
        detectedColumns: ingestionPreview.detectedColumns,
        dataInterpretation: ingestionPreview.dataInterpretation,
        retailerDisplayName: confirmedRetailer || retailerInput,
        eprAverage:
          Object.values(eprScores).length > 0
            ? Object.values(eprScores).reduce((a, b) => a + b, 0) /
              Object.values(eprScores).length
            : null,
      },
      opportunityExposure: opportunityExposure ?? undefined,
    });
  }, [
    diagnosticReady,
    knowledgeContext,
    ingestionPreview,
    eprScores,
    archetypeId,
    knowledgePosture,
    categoryRoles,
    retailerEnrichment.context.ticker,
    confirmedRetailer,
    retailerInput,
    opportunityExposure,
  ]);

  const hasRevenueInScope = parseNumericInput(revenueInScopeInput) !== null;

  const storylineResult = useMemo(() => {
    if (!diagnosticReady) return EMPTY_STORYLINE_RESULT;
    return runOpportunityStorylineEngine({
      hypothesisOutput,
      knowledge: knowledgeContext,
      retailerDisplayName: confirmedRetailer || retailerInput,
      hasRevenueInScope,
      computedEvidence: computedEvidence ?? undefined,
    });
  }, [
    diagnosticReady,
    hypothesisOutput,
    knowledgeContext,
    confirmedRetailer,
    retailerInput,
    hasRevenueInScope,
    computedEvidence,
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
      computedEvidence: computedEvidence ?? undefined,
      opportunityExposure: opportunityExposure ?? undefined,
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
    computedEvidence,
    opportunityExposure,
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
        setFinancePeers(suggestFinancePeers(bundle));
        if (bundle.context.ticker && !manualTicker) {
          setManualTicker(bundle.context.ticker);
        }
        const hint = resolveRetailerArchetypeHint(
          name.trim(),
          bundle.context.ticker,
        );
        if (hint) {
          setArchetypeId(hint.archetypeId);
          setKnowledgePosture(hint.pricingPosture);
          if (hint.retailerFormat) setRetailerFormat(hint.retailerFormat);
        } else {
          if (bundle.suggestions.suggestedArchetypeId) {
            setArchetypeId(bundle.suggestions.suggestedArchetypeId);
          }
          if (bundle.suggestions.suggestedPosture) {
            setKnowledgePosture(bundle.suggestions.suggestedPosture);
          }
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
    const hint = resolveRetailerArchetypeHint(trimmed, manualTicker || null);
    if (hint) {
      setArchetypeId(hint.archetypeId);
      setKnowledgePosture(hint.pricingPosture);
      if (hint.retailerFormat) setRetailerFormat(hint.retailerFormat);
      setCompetitors(createSuggestedCompetitors(hint.retailerFormat ?? retailerFormat));
    } else {
      setCompetitors(createSuggestedCompetitors(retailerFormat));
      setArchetypeId(formatToArchetypeId(retailerFormat));
    }
    void refreshEnrichment(trimmed);
  };

  const handleRetailerFormatChange = (format: RetailerFormat) => {
    setRetailerFormat(format);
    setArchetypeId(formatToArchetypeId(format));
  };

  const handleUploadFilesChange = (_count: number, names: string[]) => {
    setUploadFileNames(names);
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
    setCategoryRolesEdited(null);
    setStrategicContext(preset.strategicContext);
    setTotalRevenueInput(preset.totalRevenueInput);
    setAddressablePercentInput(preset.addressablePercentInput);
    setRevenueFromProfile(true);
    setCompetitors(createSuggestedCompetitors(preset.retailerFormat));
    setWorkflowTab("retailer_context");
    void refreshEnrichment(preset.retailerName);
  };

  const marginOpportunityRange = diagnosticReady
    ? storylineResult.storyline.marginOpportunityTotalRange
    : undefined;

  const renderWorkflowPanel = () => {
    switch (workflowTab) {
      case "retailer_context":
        return (
          <RetailerContextPanel
            retailerName={retailerInput}
            retailerEnrichment={retailerEnrichment}
            manualTicker={manualTicker}
            enrichmentLoading={enrichmentLoading}
            financePeers={financePeers}
            onRetailerNameChange={setRetailerInput}
            onConfirmRetailer={handleConfirmRetailer}
            onManualTickerChange={setManualTicker}
            onEnrichmentOverrides={handleEnrichmentOverrides}
            onRefreshEnrichment={() =>
              refreshEnrichment(confirmedRetailer || retailerInput)
            }
            onFinancePeersChange={(peers) =>
              setFinancePeers(refreshFinancePeerResolution(peers))
            }
            onAddFinancePeer={(name) =>
              setFinancePeers((prev) =>
                refreshFinancePeerResolution([
                  ...prev,
                  createUserFinancePeer(name),
                ]),
              )
            }
            onGoToUploadScope={() => setWorkflowTab("upload_scope")}
          />
        );
      case "upload_scope":
        return (
          <UploadScopePanel
            retailerName={confirmedRetailer}
            archetypeId={archetypeId}
            suggestedArchetypeId={
              retailerEnrichment.suggestions.suggestedArchetypeId
            }
            knowledgePosture={knowledgePosture}
            suggestedPosture={retailerEnrichment.suggestions.suggestedPosture}
            categoryRoles={categoryRoles}
            totalRevenueInput={totalRevenueInput}
            addressablePercentInput={addressablePercentInput}
            revenueFromProfile={revenueFromProfile}
            onArchetypeChange={setArchetypeId}
            onKnowledgePostureChange={setKnowledgePosture}
            onCategoryRolesChange={setCategoryRolesEdited}
            onTotalRevenueChange={(v) => {
              setRevenueFromProfile(false);
              setTotalRevenueInput(v);
            }}
            onAddressablePercentChange={setAddressablePercentInput}
            onUploadFilesChange={handleUploadFilesChange}
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
            categoryRoles={categoryRoles}
            retailerDisplayName={confirmedRetailer || retailerInput}
            retailerTicker={retailerEnrichment.context.ticker}
            computedEvidence={computedEvidence}
            opportunityExposure={opportunityExposure}
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
        marginOpportunityRange={marginOpportunityRange}
        diagnosticReady={diagnosticReady}
      />
      {renderWorkflowPanel()}
    </AppShell>
  );
}
