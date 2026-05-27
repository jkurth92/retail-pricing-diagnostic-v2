"use client";

import { Disclosure } from "@/components/Disclosure";
import type { RefinementSliderState } from "@/types/refinement";
import type { RefinementState } from "@/types/refinement";

type RefineDiagnosticPanelProps = {
  state: RefinementState;
  onSlidersChange: (sliders: RefinementSliderState) => void;
  onFeedbackChange: (text: string) => void;
  onPreview: () => void;
  onApply: () => void;
  onReset: () => void;
  hasPendingControls: boolean;
  isPreview: boolean;
  isApplied: boolean;
  diagnosticReady: boolean;
};

function sliderHint(
  value: number,
  left: string,
  right: string,
): string {
  if (value <= 35) return left;
  if (value >= 65) return right;
  return "Balanced (engine default)";
}

export function RefineDiagnosticPanel({
  state,
  onSlidersChange,
  onFeedbackChange,
  onPreview,
  onApply,
  onReset,
  hasPendingControls,
  isPreview,
  isApplied,
  diagnosticReady,
}: RefineDiagnosticPanelProps) {
  if (!diagnosticReady) {
    return (
      <section className="refine-diagnostic-panel">
        <p className="section-eyebrow">Consultant refinement</p>
        <h3 className="section-heading">Refine diagnostic</h3>
        <p className="section-lead">
          Generate the diagnostic first, then guide storyline emphasis and framing
          without changing underlying evidence.
        </p>
      </section>
    );
  }

  const { sliders, feedbackText, trail } = state;

  const patchSlider = (key: keyof RefinementSliderState, value: number) => {
    onSlidersChange({ ...sliders, [key]: value });
  };

  return (
    <section className="refine-diagnostic-panel">
      <p className="section-eyebrow">Consultant refinement</p>
      <h3 className="section-heading">Refine diagnostic</h3>
      <p className="section-lead">
        Guide storyline emphasis, opportunity framing, and narrative tone. Changes
        shape interpretation only — evidence and sizing stay as computed.
      </p>

      <div className="refine-controls-card mt-6 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--text-navy)]">
            Consultant feedback
          </span>
          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
            Plain language — mapped to bounded emphasis (not open-ended AI rewriting).
          </span>
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder='e.g. "Emphasize premiumization over value concentration" or "Tighten the opportunity range"'
            className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-navy)]"
          />
        </label>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-navy)]">
              Opportunity framing
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={sliders.opportunityFraming}
              onChange={(e) =>
                patchSlider("opportunityFraming", Number(e.target.value))
              }
              className="refine-slider mt-2 w-full"
            />
            <span className="text-xs text-[var(--text-muted)]">
              {sliderHint(
                sliders.opportunityFraming,
                "Conservative — tighter opportunity width",
                "Aggressive — wider opportunity width",
              )}
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--text-navy)]">
              Architecture emphasis
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={sliders.architectureEmphasis}
              onChange={(e) =>
                patchSlider("architectureEmphasis", Number(e.target.value))
              }
              className="refine-slider mt-2 w-full"
            />
            <span className="text-xs text-[var(--text-muted)]">
              {sliderHint(
                sliders.architectureEmphasis,
                "Lower architecture weighting in storyline",
                "Higher architecture weighting in storyline",
              )}
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--text-navy)]">
              Confidence adjustment
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={sliders.confidenceAdjustment}
              onChange={(e) =>
                patchSlider("confidenceAdjustment", Number(e.target.value))
              }
              className="refine-slider mt-2 w-full"
            />
            <span className="text-xs text-[var(--text-muted)]">
              {sliderHint(
                sliders.confidenceAdjustment,
                "Cautious narrative framing",
                "Assertive narrative framing",
              )}
            </span>
          </label>
        </div>

        {trail.length > 0 && (
          <Disclosure
            title="Interpretation trail"
            variant="subtle"
            defaultOpen={isPreview || isApplied}
            className="mt-5"
          >
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-[var(--text-navy)]">
              {trail.map((entry) => (
                <li key={entry.id}>{entry.label}</li>
              ))}
            </ul>
          </Disclosure>
        )}

        <div className="refine-actions mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text-navy)] hover:bg-[var(--surface-muted)]"
            onClick={onPreview}
            disabled={!hasPendingControls}
          >
            Preview refined narrative
          </button>
          <button
            type="button"
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            onClick={onApply}
            disabled={!hasPendingControls && !isPreview}
          >
            Apply refinements
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-navy)]"
            onClick={onReset}
            disabled={!isPreview && !isApplied && !hasPendingControls}
          >
            Reset refinements
          </button>
        </div>

        {isPreview && (
          <p className="mt-3 text-xs text-amber-800">
            Preview active — review pricing diagnostic and memo, then apply or reset.
          </p>
        )}
        {isApplied && (
          <p className="mt-3 text-xs text-[var(--accent-deep)]">
            Refinements applied. Reset anytime to restore the base engine interpretation.
          </p>
        )}
      </div>
    </section>
  );
}
