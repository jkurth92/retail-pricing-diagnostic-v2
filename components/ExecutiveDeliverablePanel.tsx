"use client";

import type { ReactNode } from "react";
import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutivePilotSummary } from "@/components/executive/ExecutivePilotSummary";
import { ExecutiveThemeInsightCard } from "@/components/executive/ExecutiveThemeInsightCard";
import { exportReadinessLabel } from "@/lib/exportScaffold";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportPackage } from "@/types/export-structure";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSection } from "@/types/storyline-sections";

export type ExecutivePanelView =
  | "full"
  | "compact"
  | "profile"
  | "themes"
  | "opportunity"
  | "implications";

function ThemeListItem({ theme, rank }: { theme: ExecutiveTheme; rank?: boolean }) {
  return (
    <li className="theme-list-item">
      {rank && (
        <span className="dx-rank-badge">{theme.rank}</span>
      )}
      <ExecutiveThemeInsightCard theme={theme} />
    </li>
  );
}

function StorylineSectionItem({ section }: { section: StorylineSection }) {
  return (
    <article className="py-4 border-b border-[var(--border)] last:border-0">
      <h4 className="text-sm font-semibold text-[var(--text-navy)]">
        {section.sectionTitle}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-navy)]">
        {section.sectionNarrative}
      </p>
    </article>
  );
}

type ExecutiveDeliverablePanelProps = {
  readout: DiagnosticReadout;
  exportPackage: ExportPackage;
  view?: ExecutivePanelView;
  /** Pilot: evidence-first executive layout */
  pilotMode?: boolean;
  /** Optional consultant-mode panels (technical diagnostics, etc.) */
  consultantSlot?: ReactNode;
  opportunityExposure?: import("@/types/opportunity-exposure").OpportunityExposureBundle | null;
  computedEvidence?: import("@/types/evidence-computation").ComputedEvidenceBundle | null;
};

export function ExecutiveDeliverablePanel({
  readout,
  exportPackage,
  view = "full",
  pilotMode = false,
  consultantSlot,
  opportunityExposure,
  computedEvidence,
}: ExecutiveDeliverablePanelProps) {
  const { executiveSummary: exec } = readout;
  const profile = exec.retailerProfile;

  if (view === "compact") {
    return (
      <div className="exec-readout">
        <ExecutivePilotSummary
          exec={exec}
          opportunityExposure={opportunityExposure ?? exec.opportunityExposure}
          computedEvidence={computedEvidence}
        />
      </div>
    );
  }

  if (view === "profile") {
    return (
      <DiagnosticSection
        eyebrow="Retailer pricing profile"
        title={`${profile.archetype} · ${profile.posture}`}
        lead={exec.maturitySummary}
      >
        <dl className="grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Category role structure
            </dt>
            <dd className="mt-1.5 text-[var(--text-navy)]">
              {profile.inferredCategoryRoleStructure}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Item role structure
            </dt>
            <dd className="mt-1.5 text-[var(--text-navy)]">
              {profile.inferredItemRoleStructure}
            </dd>
          </div>
        </dl>
        {profile.notes.length > 0 && (
          <Disclosure
            title="Role assumptions"
            summary="Consultant context"
            variant="subtle"
          >
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
              {profile.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Disclosure>
        )}
      </DiagnosticSection>
    );
  }

  if (view === "themes") {
    return (
      <DiagnosticSection
        eyebrow="Structural themes"
        title="Top structural themes"
        lead="Evidence-backed themes from the diagnostic."
      >
        <ul>
          {exec.topThemes.slice(0, 3).map((t) => (
            <ThemeListItem key={t.id} theme={t} rank />
          ))}
        </ul>
      </DiagnosticSection>
    );
  }

  if (view === "opportunity") {
    return null;
  }

  if (view === "implications") {
    return (
      <DiagnosticSection
        eyebrow="Strategic implications"
        title="What this means"
        lead="Concise structural interpretation — not tactical price prescriptions."
      >
        <ul className="dx-implication-callouts">
          {exec.strategicImplications.slice(0, 3).map((imp) => (
            <li key={imp}>{imp}</li>
          ))}
        </ul>
      </DiagnosticSection>
    );
  }

  if (pilotMode) {
    const technicalSlot = (
      <>
        {consultantSlot}
        {readout.storylineSections.length > 0 && (
          <div className="dx-tech-storyline">
            {readout.storylineSections.map((s) => (
              <StorylineSectionItem key={s.id} section={s} />
            ))}
          </div>
        )}
      </>
    );

    return (
      <div className="dx-deliverable-wrap">
        <ExecutivePilotSummary
          exec={exec}
          opportunityExposure={opportunityExposure ?? exec.opportunityExposure}
          computedEvidence={computedEvidence}
          technicalDiagnosticsSlot={
            consultantSlot || readout.storylineSections.length > 0 ? technicalSlot : undefined
          }
        />
      </div>
    );
  }

  const sections: { view: Exclude<ExecutivePanelView, "full" | "compact"> }[] = [
    { view: "profile" },
    { view: "themes" },
    { view: "implications" },
  ];

  return (
    <div className="space-y-0">
      <DiagnosticSection
        eyebrow="Executive summary"
        title="Pricing diagnostic readout"
        lead={exec.executiveNarrative}
      >
        <ExecutivePilotSummary
          exec={exec}
          opportunityExposure={opportunityExposure ?? exec.opportunityExposure}
        />
      </DiagnosticSection>

      {sections.map(({ view: sectionView }) => (
        <ExecutiveDeliverablePanel
          key={sectionView}
          readout={readout}
          exportPackage={exportPackage}
          view={sectionView}
        />
      ))}

      <div className="diagnostic-section">
        <Disclosure
          title="Deliverable preparation"
          summary={exportReadinessLabel(exportPackage)}
          variant="subtle"
        >
          <p className="text-sm text-[var(--text-muted)]">
            {exportPackage.storylineBlocks.length} storyline sections packaged for export.
          </p>
        </Disclosure>
      </div>
    </div>
  );
}
