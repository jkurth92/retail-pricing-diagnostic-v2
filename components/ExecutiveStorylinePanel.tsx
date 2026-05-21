"use client";

import { Card } from "@/components/Card";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";

const CONFIDENCE_STYLES: Record<DiagnosticConfidenceLevel, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-50 text-amber-900",
  medium_high: "bg-sky-50 text-sky-900",
  high: "bg-emerald-50 text-emerald-900",
};

function ThemeBlock({ theme, variant }: { theme: ExecutiveTheme; variant: "primary" | "secondary" }) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        variant === "primary"
          ? "border-[var(--accent)] bg-white"
          : "border-[var(--border)] bg-[var(--surface-muted)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            #{theme.rank} · {theme.themeFamily}
          </span>
          <h4 className="mt-1 text-base font-semibold text-[var(--text-navy)]">
            {theme.themeName}
          </h4>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${CONFIDENCE_STYLES[theme.confidence.level]}`}
        >
          {theme.confidence.level.replace("_", " ")}
        </span>
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">{theme.summary}</p>
      <p className="mt-3 text-sm font-medium text-[var(--accent)]">
        {theme.marginOpportunityRange}
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Revenue sensitivity: {theme.revenueSensitivityRange}
      </p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Supporting hypotheses
        </p>
        <ul className="mt-1 list-disc pl-5 text-sm text-[var(--text-navy)]">
          {theme.supportingHypotheses.map((h) => (
            <li key={h.id}>{h.hypothesisName}</li>
          ))}
        </ul>
      </div>
      {theme.supportingSignals.length > 0 && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Signals:{" "}
          {theme.supportingSignals
            .slice(0, 4)
            .map((s) => s.signalName)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

type ExecutiveStorylinePanelProps = {
  result: StorylineSynthesisResult & {
    engineVersion?: string;
    guardrailMessage?: string;
  };
  compact?: boolean;
};

export function ExecutiveStorylinePanel({
  result,
  compact = false,
}: ExecutiveStorylinePanelProps) {
  const { storyline, opportunity } = result;

  if (compact) {
    return (
      <Card className="border-l-4 border-l-[var(--accent)]">
        <p className="micro-label mb-2">Executive storyline</p>
        <h3 className="section-title">{storyline.title}</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {storyline.executiveSummary}
        </p>
        <p className="mt-3 text-lg font-semibold text-[var(--accent)]">
          {storyline.marginOpportunityTotalRange}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {storyline.confidenceSummary}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--accent-light)] border-2 border-[var(--accent)]">
        <p className="micro-label mb-2">Opportunity & storyline engine</p>
        <h3 className="text-xl font-semibold text-[var(--text-navy)]">
          {storyline.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-navy)]">
          {storyline.executiveSummary}
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Total margin opportunity (thematic)
            </dt>
            <dd className="mt-1 text-lg font-semibold text-[var(--accent)]">
              {storyline.marginOpportunityTotalRange}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Revenue sensitivity
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {storyline.revenueSensitivitySummary}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Confidence
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {storyline.confidenceSummary}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <p className="micro-label mb-2">Narrative</p>
        <h3 className="section-title">Consulting storyline</h3>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--text-navy)] whitespace-pre-line">
          {storyline.narrative}
        </div>
      </Card>

      <div>
        <p className="micro-label mb-3">
          Primary executive themes ({storyline.primaryThemes.length})
        </p>
        <div className="space-y-4">
          {storyline.primaryThemes.map((t) => (
            <ThemeBlock key={t.id} theme={t} variant="primary" />
          ))}
        </div>
      </div>

      {storyline.secondaryThemes.length > 0 && (
        <div>
          <p className="micro-label mb-3">Secondary themes</p>
          <div className="space-y-4">
            {storyline.secondaryThemes.map((t) => (
              <ThemeBlock key={t.id} theme={t} variant="secondary" />
            ))}
          </div>
        </div>
      )}

      <Card>
        <p className="micro-label mb-2">Opportunity summary</p>
        <h3 className="section-title">Aggregated framing</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Status: {opportunity.status.replace(/_/g, " ")}
        </p>
        <ul className="mt-4 space-y-2">
          {opportunity.primaryOpportunityDrivers.map((d) => (
            <li
              key={d.label}
              className="flex justify-between gap-4 border-b border-[var(--border)] pb-2 text-sm"
            >
              <span className="font-medium text-[var(--text-navy)]">
                {d.label}
              </span>
              <span className="text-[var(--accent)]">{d.marginRange}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-4 list-disc pl-5 text-xs text-[var(--text-muted)]">
          {opportunity.caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
