"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import type { LeverKey } from "@/types/diagnostic-output";
import type { DiagnosticUnlockStatus } from "@/types/ingestion";

const SECTION_LABELS: Record<LeverKey, string> = {
  kvis: "KVI patterns",
  price_architecture: "Price architecture patterns",
  price_zoning: "Price zoning patterns",
  promotions: "Promotion patterns",
  markdown: "Markdown patterns",
};

function unlockStatusLabel(status: DiagnosticUnlockStatus): string {
  if (status === "ready") return "Ready for rule alignment";
  if (status === "available") return "Available after rule alignment";
  if (status === "limited") return "Limited — additional fields recommended";
  return "Unavailable";
}

export function ObservedPricingPatternsPanel() {
  const dataset = useMemo(() => buildPlaceholderIngestionDataset(), []);
  const unlockByLever = useMemo(
    () => new Map(dataset.leverUnlocks.map((u) => [u.leverKey, u])),
    [dataset.leverUnlocks],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] px-6 py-5">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          Observed pricing patterns will be generated after upload schema,
          feature generation, and diagnostic rules are aligned. No pricing
          rules, thresholds, or opportunity calculations are active.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Diagnostic unlock status below reflects normalized field coverage from
          the ingestion preview only.
        </p>
      </div>

      {(Object.keys(SECTION_LABELS) as LeverKey[]).map((leverKey) => {
        const unlock = unlockByLever.get(leverKey);
        const status = unlock?.status ?? "unavailable";
        const isUnavailable = status === "unavailable";
        const isLimited = status === "limited";

        return (
          <Card key={leverKey}>
            <p className="micro-label mb-2">Diagnostic evidence</p>
            <h3 className="section-title">{SECTION_LABELS[leverKey]}</h3>
            <p className="mt-2 text-sm text-[var(--text-navy)]">
              {unlock?.message ??
                "Status pending normalization preview."}
            </p>
            <p className="mt-2 text-xs font-medium text-[var(--accent)]">
              Unlock: {unlockStatusLabel(status)}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  {isUnavailable
                    ? "Unavailable — missing required normalized fields"
                    : isLimited
                      ? "Limited — minimum fields partially met"
                      : "Eligible after diagnostic rule alignment"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Evidence
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  {isUnavailable ? "Pending" : "Preview mappings present"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Findings
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  Not generated
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Opportunity impact
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  Not calculated
                </dd>
              </div>
            </dl>
          </Card>
        );
      })}
    </div>
  );
}
