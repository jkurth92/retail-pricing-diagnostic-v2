"use client";

import { useId, useState } from "react";
import type { IllustrativeCommercialExample } from "@/types/evidence-illustrations";

type IllustrativeExamplesPanelProps = {
  examples: IllustrativeCommercialExample[];
  disclaimer?: string;
};

export function IllustrativeExamplesPanel({
  examples,
  disclaimer,
}: IllustrativeExamplesPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (examples.length === 0) return null;

  return (
    <div className="ent-illustrations mt-2 border-t border-[var(--border)]/80 pt-2">
      <button
        type="button"
        className="ent-illustrations-toggle flex w-full items-center justify-between gap-2 rounded-md px-0.5 py-1 text-left text-[0.6875rem] font-semibold text-[var(--accent-deep)] hover:bg-[var(--accent-light)]/30"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? "Hide detail" : "Where we saw it"}</span>
        <span className="text-[var(--text-muted)]" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div id={panelId} className="ent-illustrations-body mt-2 space-y-3">
          {examples.map((ex, i) => (
            <div
              key={`${ex.category}-${i}`}
              className="rounded-lg border border-[var(--border)]/90 bg-white/80 px-3 py-2.5"
            >
              <p className="m-0 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-navy)]">
                {ex.category}
              </p>
              <p className="m-0 mt-1 text-xs leading-snug text-[var(--text-navy)]">
                {ex.observation}
              </p>
              <p className="m-0 mt-1 text-[0.6875rem] leading-snug text-[var(--text-muted)]">
                {ex.interpretation}
              </p>
            </div>
          ))}
          {disclaimer && (
            <p className="m-0 text-[0.625rem] leading-snug text-[var(--text-muted)]">
              {disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
