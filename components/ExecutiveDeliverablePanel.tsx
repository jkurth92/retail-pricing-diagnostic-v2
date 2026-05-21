"use client";

import { Card } from "@/components/Card";
import { exportReadinessLabel } from "@/lib/exportScaffold";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExportPackage } from "@/types/export-structure";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSection } from "@/types/storyline-sections";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";

const CONFIDENCE_STYLES: Record<DiagnosticConfidenceLevel, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-50 text-amber-900",
  medium_high: "bg-sky-50 text-sky-900",
  high: "bg-emerald-50 text-emerald-900",
};

function ThemeRow({ theme }: { theme: ExecutiveTheme }) {
  return (
    <li className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            #{theme.rank} · {theme.themeFamily}
          </span>
          <p className="mt-1 font-semibold text-[var(--text-navy)]">
            {theme.themeName}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${CONFIDENCE_STYLES[theme.confidence.level]}`}
        >
          {theme.confidence.level.replace("_", " ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{theme.summary}</p>
      <p className="mt-2 text-sm font-medium text-[var(--accent)]">
        {theme.marginOpportunityRange}
      </p>
    </li>
  );
}

function StorylineSectionBlock({ section }: { section: StorylineSection }) {
  return (
    <article className="border-b border-[var(--border)] pb-6 last:border-0">
      <h4 className="text-base font-semibold text-[var(--text-navy)]">
        {section.sectionTitle}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-navy)]">
        {section.sectionNarrative}
      </p>
      {section.supportingThemes.length > 0 && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Themes:{" "}
          {section.supportingThemes.map((t) => t.themeName).join(" · ")}
        </p>
      )}
      {section.supportingSignals.length > 0 && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Signals:{" "}
          {section.supportingSignals
            .slice(0, 4)
            .map((s) => s.signalName)
            .join(" · ")}
        </p>
      )}
      {section.opportunitySummary !== "—" && (
        <p className="mt-2 text-xs font-medium text-[var(--accent)]">
          {section.opportunitySummary}
        </p>
      )}
      <p className="mt-1 text-xs italic text-[var(--text-muted)]">
        {section.confidenceSummary}
      </p>
    </article>
  );
}

type ExecutiveDeliverablePanelProps = {
  readout: DiagnosticReadout;
  exportPackage: ExportPackage;
  compact?: boolean;
};

export function ExecutiveDeliverablePanel({
  readout,
  exportPackage,
  compact = false,
}: ExecutiveDeliverablePanelProps) {
  const { executiveSummary: exec } = readout;
  const profile = exec.retailerProfile;

  if (compact) {
    return (
      <Card className="border-l-4 border-l-[var(--accent)]">
        <p className="micro-label mb-2">Executive diagnostic readout</p>
        <p className="text-sm leading-relaxed text-[var(--text-navy)]">
          {exec.executiveNarrative}
        </p>
        <p className="mt-3 text-lg font-semibold text-[var(--accent)]">
          {exec.marginOpportunitySummary}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {exec.confidenceSummary}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-[var(--accent)] bg-[var(--accent-light)]">
        <p className="micro-label mb-2">Executive summary</p>
        <p className="text-sm leading-relaxed text-[var(--text-navy)]">
          {exec.executiveNarrative}
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Margin opportunity (primary)
            </dt>
            <dd className="mt-1 text-lg font-semibold text-[var(--accent)]">
              {exec.marginOpportunitySummary}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Revenue sensitivity (secondary)
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {exec.revenueSensitivitySummary}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Confidence
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {exec.confidenceSummary}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          {exec.maturitySummary}
        </p>
      </Card>

      <Card>
        <p className="micro-label mb-2">Retailer pricing profile</p>
        <h3 className="section-title">
          {profile.archetype} · {profile.posture}
        </h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-[var(--text-muted)]">
              Category role structure
            </dt>
            <dd className="mt-1 text-[var(--text-navy)]">
              {profile.inferredCategoryRoleStructure}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-[var(--text-muted)]">
              Item role structure
            </dt>
            <dd className="mt-1 text-[var(--text-navy)]">
              {profile.inferredItemRoleStructure}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-[var(--text-muted)]">
              Architecture profile
            </dt>
            <dd className="mt-1 text-[var(--text-navy)]">
              {profile.architectureProfile}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-[var(--text-muted)]">
              Strategic orientation
            </dt>
            <dd className="mt-1 text-[var(--text-navy)]">
              {profile.strategicOrientation}
            </dd>
          </div>
        </dl>
        {profile.notes.length > 0 && (
          <ul className="mt-4 list-disc pl-5 text-xs text-[var(--text-muted)]">
            {profile.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <p className="micro-label mb-3">Top strategic themes</p>
        <ul className="space-y-3">
          {exec.topThemes.map((t) => (
            <ThemeRow key={t.id} theme={t} />
          ))}
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">Opportunity overview</p>
        <p className="text-sm leading-relaxed text-[var(--text-navy)]">
          {readout.opportunityOverview}
        </p>
      </Card>

      <Card>
        <p className="micro-label mb-2">Consulting storyline</p>
        <h3 className="section-title">Structured narrative flow</h3>
        <div className="mt-6 space-y-6">
          {readout.storylineSections.map((s) => (
            <StorylineSectionBlock key={s.id} section={s} />
          ))}
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Strategic implications</p>
        <p className="text-xs text-[var(--text-muted)]">
          What the structure means — not tactical price prescriptions.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--text-navy)]">
          {readout.strategicImplications.map((imp) => (
            <li key={imp}>{imp}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">Supporting signals</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {readout.supportingThemes
            .flatMap((t) => t.supportingSignals)
            .filter(
              (s, i, arr) =>
                arr.findIndex((x) => x.signalId === s.signalId) === i,
            )
            .slice(0, 12)
            .map((s) => (
              <li
                key={s.signalId}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-[var(--text-navy)]"
              >
                {s.signalName}
              </li>
            ))}
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">Next focus areas</p>
        <ul className="list-disc pl-5 text-sm text-[var(--text-navy)]">
          {exec.nextFocusAreas.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Card>

      <Card className="border-dashed">
        <p className="micro-label mb-2">Export scaffold</p>
        <p className="text-sm text-[var(--text-muted)]">
          {exportReadinessLabel(exportPackage)} — format:{" "}
          {exportPackage.format.replace("_", " ")} ·{" "}
          {exportPackage.storylineBlocks.length} storyline blocks prepared.
        </p>
        <ul className="mt-3 list-disc pl-5 text-xs text-[var(--text-muted)]">
          {exportPackage.footerNotes.slice(0, 3).map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
