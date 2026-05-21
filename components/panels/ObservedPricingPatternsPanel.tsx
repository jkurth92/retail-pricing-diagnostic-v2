"use client";

import { useMemo } from "react";
import { PatternFeatureLeverCard } from "@/components/PatternFeatureLeverCard";
import { BenchmarkConceptExplorer } from "@/components/BenchmarkConceptExplorer";
import { RoleInferencePreview } from "@/components/RoleInferencePreview";
import { Card } from "@/components/Card";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { buildObservedPatternsOutput } from "@/lib/patternFeatureBuilder";
import {
  architectureMonetizationCategories,
  benchmarkConceptsForArchetype,
  expectedStructureHeadline,
  likelyTrafficCategories,
  suggestedKviConcentrationNote,
  objectivesAdjustEmphasis,
} from "@/lib/archetypeContext";
import { PATTERN_FEATURE_COUNT } from "@/data/patternFeatureCatalog";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type ObservedPricingPatternsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  categoryHint: string;
  onCategoryHintChange: (value: string) => void;
};

export function ObservedPricingPatternsPanel({
  knowledgeContext,
  categoryHint,
  onCategoryHintChange,
}: ObservedPricingPatternsPanelProps) {
  const output = useMemo(() => {
    const dataset = buildPlaceholderIngestionDataset();
    return buildObservedPatternsOutput(
      dataset.normalizedFields,
      dataset.leverUnlocks,
    );
  }, []);

  const archetypeConcepts = useMemo(
    () => benchmarkConceptsForArchetype(knowledgeContext.archetypeId),
    [knowledgeContext.archetypeId],
  );

  const trafficCategories = useMemo(
    () => likelyTrafficCategories(knowledgeContext.archetypeId),
    [knowledgeContext.archetypeId],
  );

  const monetizationCategories = useMemo(
    () => architectureMonetizationCategories(knowledgeContext.archetypeId),
    [knowledgeContext.archetypeId],
  );

  const objectiveNotes = useMemo(
    () => objectivesAdjustEmphasis(knowledgeContext.strategicObjectives),
    [knowledgeContext.strategicObjectives],
  );

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
          {expectedStructureHeadline(
            knowledgeContext.archetypeId,
            knowledgeContext.pricingPosture,
          )}
          . Pattern catalog: {PATTERN_FEATURE_COUNT} features. Findings,
          recommendations, and opportunity sizing remain disabled.
        </p>
      </div>

      <Card>
        <p className="micro-label mb-2">Knowledge context</p>
        <h3 className="section-title">Expected structure preview</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Likely traffic-driving categories
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {trafficCategories.length > 0
                ? trafficCategories.join(", ")
                : "Define archetype for examples"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Architecture-oriented monetization categories
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {monetizationCategories.length > 0
                ? monetizationCategories.join(", ")
                : "Pending archetype mapping"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-[var(--text-navy)]">
          {suggestedKviConcentrationNote(knowledgeContext.archetypeId)}
        </p>
        {objectiveNotes.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-sm text-[var(--text-muted)]">
            {objectiveNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs italic text-[var(--text-muted)]">
          Available after alignment — feature values and rule interpretation not
          calculated.
        </p>
      </Card>

      <RoleInferencePreview
        context={{ ...knowledgeContext, categoryHint }}
        categoryHint={categoryHint}
        onCategoryHintChange={onCategoryHintChange}
      />

      <BenchmarkConceptExplorer
        concepts={archetypeConcepts}
        title="Benchmark concept families relevant to retailer archetype"
      />

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
