"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HeaderSummary } from "@/components/HeaderSummary";
import { PrimaryTabs } from "@/components/PrimaryTabs";
import { WorkflowTabs } from "@/components/WorkflowTabs";
import { ClientContextPanel } from "@/components/panels/ClientContextPanel";
import { OpportunitySizePanel } from "@/components/panels/OpportunitySizePanel";
import { RetailerOverviewPanel } from "@/components/panels/RetailerOverviewPanel";
import { ScopePanel } from "@/components/panels/ScopePanel";
import {
  DEFAULT_EPR_SCORES,
  type EprDimension,
  type EprScores,
  type PrimaryModule,
  type PricingPosture,
  type RetailerFormat,
  type WorkflowStep,
  type WorkflowTab,
} from "@/types/ui";

function getSidebarStep(tab: WorkflowTab): WorkflowStep {
  if (tab === "opportunitySize") return "opportunity";
  if (tab === "scope" || tab === "retailerOverview") return "analysis";
  return "context";
}

export default function Home() {
  const [primaryModule, setPrimaryModule] = useState<PrimaryModule>("overview");
  const [workflowTab, setWorkflowTab] = useState<WorkflowTab>("clientContext");
  const [retailerInput, setRetailerInput] = useState("");
  const [confirmedRetailer, setConfirmedRetailer] = useState("");
  const [eprScores, setEprScores] = useState<EprScores>(DEFAULT_EPR_SCORES);
  const [pricingPosture, setPricingPosture] =
    useState<PricingPosture>("Not sure");
  const [retailerFormat, setRetailerFormat] =
    useState<RetailerFormat>("Grocery");
  const [competitorSet, setCompetitorSet] = useState("");
  const [strategicContext, setStrategicContext] = useState("");

  const retailerDisplay = confirmedRetailer.trim() || "Not selected";

  const handlePopulateRetailer = () => {
    const trimmed = retailerInput.trim();
    setConfirmedRetailer(trimmed || "");
  };

  const handleEprScoreChange = (dimension: EprDimension, score: number) => {
    setEprScores((prev) => ({ ...prev, [dimension]: score }));
  };

  const renderWorkflowPanel = () => {
    switch (workflowTab) {
      case "clientContext":
        return (
          <ClientContextPanel
            retailerName={retailerInput}
            confirmedRetailer={confirmedRetailer}
            eprScores={eprScores}
            pricingPosture={pricingPosture}
            retailerFormat={retailerFormat}
            competitorSet={competitorSet}
            strategicContext={strategicContext}
            onRetailerNameChange={setRetailerInput}
            onPopulateRetailer={handlePopulateRetailer}
            onEprScoreChange={handleEprScoreChange}
            onPricingPostureChange={setPricingPosture}
            onRetailerFormatChange={setRetailerFormat}
            onCompetitorSetChange={setCompetitorSet}
            onStrategicContextChange={setStrategicContext}
          />
        );
      case "scope":
        return <ScopePanel />;
      case "retailerOverview":
        return <RetailerOverviewPanel />;
      case "opportunitySize":
        return <OpportunitySizePanel />;
      default:
        return null;
    }
  };

  const renderModulePlaceholder = () => {
    if (primaryModule === "overview") {
      return null;
    }
    return (
      <div className="mb-6 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-sm text-[var(--text-muted)]">
        {primaryModule.charAt(0).toUpperCase() + primaryModule.slice(1)} module
        content requires alignment before implementation.
      </div>
    );
  };

  return (
    <AppShell activeStep={getSidebarStep(workflowTab)}>
      <HeaderSummary retailerDisplay={retailerDisplay} />
      <PrimaryTabs active={primaryModule} onChange={setPrimaryModule} />
      {renderModulePlaceholder()}
      <WorkflowTabs active={workflowTab} onChange={setWorkflowTab} />
      {renderWorkflowPanel()}
    </AppShell>
  );
}
