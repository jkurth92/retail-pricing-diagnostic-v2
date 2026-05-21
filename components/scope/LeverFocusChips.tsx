"use client";

import {
  DIAGNOSTIC_LEVERS,
  LEVER_KEY_BY_LABEL,
  type DiagnosticLever,
} from "@/types/ui";
import type { LeverKey } from "@/types/diagnostic-output";

type LeverFocusChipsProps = {
  selectedLeverKeys: Set<LeverKey>;
  onToggleLever: (leverKey: LeverKey) => void;
};

export function LeverFocusChips({
  selectedLeverKeys,
  onToggleLever,
}: LeverFocusChipsProps) {
  return (
    <section className="rc-panel-card">
      <p className="rc-eyebrow">Optional</p>
      <h3 className="rc-section-title">Diagnostic focus</h3>
      <p className="rc-card-lead mt-1">
        Select which pricing levers to emphasize in the readout.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {DIAGNOSTIC_LEVERS.map((lever: DiagnosticLever) => {
          const leverKey = LEVER_KEY_BY_LABEL[lever];
          const active = selectedLeverKeys.has(leverKey);
          return (
            <button
              key={lever}
              type="button"
              onClick={() => onToggleLever(leverKey)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-navy)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
              }`}
            >
              {lever}
            </button>
          );
        })}
      </div>
    </section>
  );
}
