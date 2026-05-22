"use client";

import type { ExecutiveConsultingSummary as SummaryModel } from "@/lib/narrativePresentation";

type ExecutiveConsultingSummaryProps = {
  summary: SummaryModel;
};

export function ExecutiveConsultingSummary({ summary }: ExecutiveConsultingSummaryProps) {
  if (summary.paragraphs.length === 0 && summary.nextSteps.length === 0) {
    return null;
  }

  return (
    <div className="ent-consulting-summary flex flex-col gap-5">
      {summary.paragraphs.map((p, i) => (
        <p
          key={`p-${i}`}
          className="m-0 text-[0.9375rem] leading-[1.65] text-[var(--text-navy)]"
        >
          {p}
        </p>
      ))}
      {summary.nextSteps.length > 0 && (
        <div className="ent-consulting-next border-t border-[color-mix(in_srgb,var(--border)_80%,transparent)] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--accent-mid)]">
            Potential next steps for client discussion
          </p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {summary.nextSteps.map((step) => (
              <li
                key={step}
                className="relative pl-5 text-sm leading-relaxed text-[var(--text-navy)] before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--accent-mid)]"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
