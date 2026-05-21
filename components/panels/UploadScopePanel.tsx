"use client";

import { useState } from "react";
import { InferredCategoryRolesTable } from "@/components/scope/InferredCategoryRolesTable";
import { ScopeAssumptionsCard } from "@/components/scope/ScopeAssumptionsCard";
import { ScopeRevenueSection } from "@/components/scope/ScopeRevenueSection";
import { WhatWeFoundPanel } from "@/components/scope/WhatWeFoundPanel";
import { RunDiagnosticCta } from "@/components/RunDiagnosticCta";
import { SimplifiedUploadPanel } from "@/components/SimplifiedUploadPanel";
import type { InferredCategoryRow } from "@/types/category-scope";
import type {
  PricingPosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";

type UploadScopePanelProps = {
  retailerName: string;
  archetypeId: RetailerArchetypeId;
  suggestedArchetypeId: RetailerArchetypeId | null;
  knowledgePosture: PricingPosture;
  suggestedPosture: PricingPosture | null;
  categoryRoles: InferredCategoryRow[];
  totalRevenueInput: string;
  addressablePercentInput: string;
  revenueFromProfile: boolean;
  onArchetypeChange: (id: RetailerArchetypeId) => void;
  onKnowledgePostureChange: (posture: PricingPosture) => void;
  onCategoryRolesChange: (rows: InferredCategoryRow[]) => void;
  onTotalRevenueChange: (value: string) => void;
  onAddressablePercentChange: (value: string) => void;
  onUploadFilesChange?: (count: number, names: string[]) => void;
  onRunDiagnostic: () => void;
  canRunDiagnostic: boolean;
  runDisabledReason?: string;
};

export function UploadScopePanel({
  retailerName,
  archetypeId,
  suggestedArchetypeId,
  knowledgePosture,
  suggestedPosture,
  categoryRoles,
  totalRevenueInput,
  addressablePercentInput,
  revenueFromProfile,
  onArchetypeChange,
  onKnowledgePostureChange,
  onCategoryRolesChange,
  onTotalRevenueChange,
  onAddressablePercentChange,
  onUploadFilesChange,
  onRunDiagnostic,
  canRunDiagnostic,
  runDisabledReason,
}: UploadScopePanelProps) {
  const [uploadedFileCount, setUploadedFileCount] = useState(0);

  const handleFilesChange = (count: number, names: string[]) => {
    setUploadedFileCount(count);
    onUploadFilesChange?.(count, names);
  };

  return (
    <div className="max-w-5xl space-y-12 pilot-panel">
      <div className="rc-step-intro">
        <h2 className="rc-step-title">Upload & confirm scope</h2>
        <p className="rc-step-lead">
          Upload pricing files, confirm what we detected, review category roles and
          revenue, then run the assessment.
        </p>
      </div>

      <section className="scope-upload-zone">
        <SimplifiedUploadPanel maxFiles={2} onFilesChange={handleFilesChange} />
      </section>

      <WhatWeFoundPanel
        retailerName={retailerName}
        uploadedFileCount={uploadedFileCount}
      />

      <InferredCategoryRolesTable
        rows={categoryRoles}
        onRowsChange={onCategoryRolesChange}
        retailerName={retailerName}
      />

      <div className="scope-section-divider">
        <ScopeRevenueSection
          retailerName={retailerName}
          totalRevenueInput={totalRevenueInput}
          addressablePercentInput={addressablePercentInput}
          revenueFromProfile={revenueFromProfile}
          onTotalRevenueChange={onTotalRevenueChange}
          onAddressablePercentChange={onAddressablePercentChange}
        />
      </div>

      <div className="scope-section-divider">
        <ScopeAssumptionsCard
          archetypeId={archetypeId}
          suggestedArchetypeId={suggestedArchetypeId}
          knowledgePosture={knowledgePosture}
          suggestedPosture={suggestedPosture}
          onArchetypeChange={onArchetypeChange}
          onKnowledgePostureChange={onKnowledgePostureChange}
        />
      </div>

      <RunDiagnosticCta
        onRun={onRunDiagnostic}
        disabled={!canRunDiagnostic}
        disabledReason={runDisabledReason}
      />
    </div>
  );
}
