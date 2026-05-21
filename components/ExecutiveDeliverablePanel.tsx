"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
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
      <p className="text-base font-semibold text-[var(--text-navy)]">
        {rank && (
          <span className="mr-2 font-normal text-[var(--text-muted)]">
            {theme.rank}.
          </span>
        )}
        {theme.themeName}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {theme.summary}
      </p>
      <p className="mt-3 text-sm font-medium text-[var(--accent)]">
        {theme.marginOpportunityRange}
      </p>
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
};

export function ExecutiveDeliverablePanel({
  readout,
  exportPackage,
  view = "full",
}: ExecutiveDeliverablePanelProps) {
  const { executiveSummary: exec } = readout;
  const profile = exec.retailerProfile;

  if (view === "compact") {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-5">
        <p className="narrative-block">{exec.executiveNarrative}</p>
        <p className="mt-4 opportunity-hero-value">
          {exec.marginOpportunitySummary}
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {exec.confidenceSummary}
        </p>
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
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Architecture profile
            </dt>
            <dd className="mt-1.5 leading-relaxed text-[var(--text-navy)]">
              {profile.architectureProfile}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Strategic orientation
            </dt>
            <dd className="mt-1.5 text-[var(--text-navy)]">
              {profile.strategicOrientation}
            </dd>
          </div>
        </dl>
        {profile.notes.length > 0 && (
          <Disclosure
            title="View role assumptions"
            summary="Consultant context and inference notes"
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
        eyebrow="Key structural themes"
        title="Observed pricing themes"
        lead="Prioritized structural narratives from the diagnostic — architecture emphasized first."
      >
        <ul>
          {exec.topThemes.map((t) => (
            <ThemeListItem key={t.id} theme={t} rank />
          ))}
        </ul>
        <Disclosure
          title="View supporting signals"
          summary="Evidence behind surfaced themes"
          variant="subtle"
        >
          <ul className="mt-2 flex flex-wrap gap-2">
            {readout.supportingThemes
              .flatMap((t) => t.supportingSignals)
              .filter(
                (s, i, arr) =>
                  arr.findIndex((x) => x.signalId === s.signalId) === i,
              )
              .map((s) => (
                <li
                  key={s.signalId}
                  className="rounded-md bg-white px-3 py-1.5 text-xs text-[var(--text-navy)] border border-[var(--border)]"
                >
                  {s.signalName}
                </li>
              ))}
          </ul>
        </Disclosure>
        <Disclosure
          title="View theme rationale"
          summary="Hypotheses grouped into each theme"
          variant="subtle"
        >
          <ul className="space-y-3 text-sm">
            {exec.topThemes.map((t) => (
              <li key={t.id}>
                <p className="font-medium text-[var(--text-navy)]">
                  {t.themeName}
                </p>
                <ul className="mt-1 list-disc pl-5 text-[var(--text-muted)]">
                  {t.supportingHypotheses.map((h) => (
                    <li key={h.id}>{h.hypothesisName}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Disclosure>
      </DiagnosticSection>
    );
  }

  if (view === "opportunity") {
    return (
      <DiagnosticSection
        eyebrow="Opportunity overview"
        title="Thematic margin opportunity"
        lead={readout.opportunityOverview}
      >
        <div className="grid gap-8 sm:grid-cols-2 max-w-3xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Margin opportunity (primary)
            </p>
            <p className="mt-2 opportunity-hero-value">
              {exec.marginOpportunitySummary}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Revenue sensitivity (secondary)
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-navy)]">
              {exec.revenueSensitivitySummary}
            </p>
          </div>
        </div>
        <Disclosure
          title="View opportunity rationale"
          summary="Drivers and framing caveats"
          variant="subtle"
        >
          <ul className="space-y-2 text-sm">
            {readout.opportunityDetail.primaryOpportunityDrivers.map((d) => (
              <li
                key={d.label}
                className="flex justify-between gap-4 border-b border-[var(--border)] pb-2"
              >
                <span>{d.label}</span>
                <span className="font-medium text-[var(--accent)]">
                  {d.marginRange}
                </span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 list-disc pl-5 text-xs text-[var(--text-muted)]">
            {readout.opportunityDetail.caveats.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Disclosure>
        <Disclosure
          title="View confidence details"
          summary={exec.confidenceSummary}
          variant="subtle"
        >
          <p className="text-sm text-[var(--text-navy)]">
            {exec.confidenceSummary}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Status: {readout.opportunityDetail.status.replace(/_/g, " ")}
          </p>
        </Disclosure>
      </DiagnosticSection>
    );
  }

  if (view === "implications") {
    return (
      <DiagnosticSection
        eyebrow="Strategic implications"
        title="What this means"
        lead="Structural interpretation only — not tactical price prescriptions."
      >
        <ul className="implication-list">
          {readout.strategicImplications.map((imp) => (
            <li key={imp}>{imp}</li>
          ))}
        </ul>
        <Disclosure
          title="View consulting storyline"
          summary="Section-by-section narrative flow for memo export"
          variant="subtle"
        >
          {readout.storylineSections.map((s) => (
            <StorylineSectionItem key={s.id} section={s} />
          ))}
        </Disclosure>
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Recommended focus areas
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-navy)]">
            {exec.nextFocusAreas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </DiagnosticSection>
    );
  }

  const sections: { view: Exclude<ExecutivePanelView, "full" | "compact"> }[] = [
    { view: "profile" },
    { view: "themes" },
    { view: "opportunity" },
    { view: "implications" },
  ];

  return (
    <div className="space-y-0">
      <DiagnosticSection
        eyebrow="Executive summary"
        title="Pricing diagnostic readout"
        lead={exec.executiveNarrative}
      >
        <p className="opportunity-hero-value">{exec.marginOpportunitySummary}</p>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {exec.revenueSensitivitySummary}
        </p>
        <Disclosure title="View confidence & maturity" variant="subtle">
          <p className="text-sm text-[var(--text-navy)]">
            {exec.confidenceSummary}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {exec.maturitySummary}
          </p>
        </Disclosure>
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
          title="Memo & deck preparation"
          summary={exportReadinessLabel(exportPackage)}
          variant="subtle"
        >
          <p className="text-sm text-[var(--text-muted)]">
            Export structure is prepared ({exportPackage.storylineBlocks.length}{" "}
            sections). File generation is not enabled in this build.
          </p>
        </Disclosure>
      </div>
    </div>
  );
}
