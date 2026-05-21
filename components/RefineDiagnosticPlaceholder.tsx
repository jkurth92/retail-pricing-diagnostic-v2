"use client";

import { Disclosure } from "@/components/Disclosure";

export function RefineDiagnosticPlaceholder() {
  return (
    <section className="refine-diagnostic-panel">
      <p className="section-eyebrow">Next iteration</p>
      <h3 className="section-heading">Refine diagnostic</h3>
      <p className="section-lead">
        Placeholder for Step 13 human-in-the-loop refinement — not active in the
        pilot build.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          disabled
          className="rounded-lg border border-dashed border-[var(--border)] px-4 py-5 text-left opacity-70"
        >
          <span className="text-sm font-semibold text-[var(--text-navy)]">
            Adjust assumptions
          </span>
          <span className="mt-2 block text-xs text-[var(--text-muted)]">
            Maturity, architecture emphasis (coming soon)
          </span>
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-dashed border-[var(--border)] px-4 py-5 text-left opacity-70"
        >
          <span className="text-sm font-semibold text-[var(--text-navy)]">
            Provide feedback
          </span>
          <span className="mt-2 block text-xs text-[var(--text-muted)]">
            Natural language refinement (coming soon)
          </span>
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-dashed border-[var(--border)] px-4 py-5 text-left opacity-70"
        >
          <span className="text-sm font-semibold text-[var(--text-navy)]">
            Calibrate opportunity
          </span>
          <span className="mt-2 block text-xs text-[var(--text-muted)]">
            Directional aggressiveness slider (coming soon)
          </span>
        </button>
      </div>

      <Disclosure
        title="Refinement controls (preview)"
        variant="subtle"
        defaultOpen={false}
      >
        <div className="space-y-6 text-sm">
          <label className="block">
            <span className="font-medium text-[var(--text-navy)]">
              Natural language feedback
            </span>
            <textarea
              disabled
              rows={3}
              placeholder="e.g. Emphasize premiumization over promotions in the storyline."
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-[var(--text-muted)]"
            />
          </label>
          <label className="block">
            <span className="font-medium text-[var(--text-navy)]">
              Opportunity framing
            </span>
            <input
              type="range"
              disabled
              min={0}
              max={100}
              defaultValue={50}
              className="mt-2 w-full"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Conservatism ↔ aggressiveness (placeholder)
            </span>
          </label>
          <label className="block">
            <span className="font-medium text-[var(--text-navy)]">
              Architecture emphasis
            </span>
            <input
              type="range"
              disabled
              min={0}
              max={100}
              defaultValue={70}
              className="mt-2 w-full"
            />
          </label>
          <label className="block">
            <span className="font-medium text-[var(--text-navy)]">
              Confidence adjustment
            </span>
            <input
              type="range"
              disabled
              min={0}
              max={100}
              defaultValue={50}
              className="mt-2 w-full"
            />
          </label>
        </div>
      </Disclosure>
    </section>
  );
}
