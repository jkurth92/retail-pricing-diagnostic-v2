"use client";

import { postureLabel } from "@/lib/archetypeContext";
import { KNOWLEDGE_PRICING_POSTURES } from "@/data/retailerArchetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";

type PricingPostureSelectorProps = {
  value: PricingPosture;
  suggested: PricingPosture | null;
  onChange: (posture: PricingPosture) => void;
};

export function PricingPostureSelector({
  value,
  suggested,
  onChange,
}: PricingPostureSelectorProps) {
  const showSuggestion = suggested && suggested !== value;

  return (
    <section className="rc-posture-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="rc-eyebrow">Pricing posture</p>
          <h3 className="rc-card-title">Pricing posture</h3>
          <p className="rc-card-lead">
            Suggested from retailer profile — adjust if the diagnostic lens should
            differ.
          </p>
        </div>
        {suggested && (
          <span className="rc-suggestion-pill">
            Suggested: {postureLabel(suggested)}
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {KNOWLEDGE_PRICING_POSTURES.map((p) => {
          const selected = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`rc-posture-chip ${selected ? "rc-posture-chip-active" : ""}`}
            >
              {postureLabel(p)}
            </button>
          );
        })}
      </div>
      {showSuggestion && (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
          onClick={() => onChange(suggested)}
        >
          Apply suggested posture ({postureLabel(suggested)})
        </button>
      )}
    </section>
  );
}
