"use client";

import { useMemo } from "react";
import { PatternFeatureLeverCard } from "@/components/PatternFeatureLeverCard";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { buildObservedPatternsOutput } from "@/lib/patternFeatureBuilder";
import { PATTERN_FEATURE_COUNT } from "@/data/patternFeatureCatalog";

export function ObservedPricingPatternsPanel() {
  const output = useMemo(() => {
    const dataset = buildPlaceholderIngestionDataset();
    return buildObservedPatternsOutput(
      dataset.normalizedFields,
      dataset.leverUnlocks,
    );
  }, []);

  const sections = [
    output.kviPatterns,
    output.architecturePatterns,
    output.zoningPatterns,
    output.promotionPatterns,
    output.markdownPatterns,
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] px-6 py-5">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          {output.guardrailMessage}
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {output.readinessSummary} Catalog defines {PATTERN_FEATURE_COUNT}{" "}
          pattern features across five levers. This is a consulting-style
          feature inventory — not a conclusions page.
        </p>
      </div>

      {output.missingInputs.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-white px-6 py-4">
          <p className="micro-label mb-1">Global missing inputs (preview)</p>
          <p className="text-sm text-[var(--text-navy)]">
            {output.missingInputs.join(", ")}
          </p>
        </div>
      )}

      <ul className="space-y-2 rounded-lg border border-[var(--border)] bg-white px-6 py-4 text-sm text-[var(--text-muted)]">
        {output.notes.map((note) => (
          <li key={note} className="list-disc pl-4">
            {note}
          </li>
        ))}
      </ul>

      {sections.map((section) => (
        <PatternFeatureLeverCard key={section.leverKey} section={section} />
      ))}
    </div>
  );
}
