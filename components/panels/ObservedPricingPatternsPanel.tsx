"use client";

import { useMemo } from "react";
import { PatternFeatureLeverCard } from "@/components/PatternFeatureLeverCard";
import { BenchmarkConceptExplorer } from "@/components/BenchmarkConceptExplorer";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { ExecutiveStorylinePanel } from "@/components/ExecutiveStorylinePanel";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import { RoleInferenceSummaryCard } from "@/components/RoleInferenceSummaryCard";
import { Card } from "@/components/Card";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { buildObservedPatternsOutput } from "@/lib/patternFeatureBuilder";
import { runDiagnosticHypothesisEngine } from "@/lib/hypothesisEngine";
import {
  architectureMonetizationCategories,
  benchmarkConceptsForArchetype,
  expectedStructureHeadline,
  likelyTrafficCategories,
  suggestedKviConcentrationNote,
  objectivesAdjustEmphasis,
} from "@/lib/archetypeContext";
import { PATTERN_FEATURE_COUNT } from "@/data/patternFeatureCatalog";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprScores } from "@/types/ui";

type ObservedPricingPatternsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  eprScores: EprScores;
  storylineResult: StorylineSynthesisResult & { guardrailMessage: string };
};

export function ObservedPricingPatternsPanel({
  knowledgeContext,
  eprScores,
  storylineResult,
}: ObservedPricingPatternsPanelProps) {
  const dataset = useMemo(() => buildPlaceholderIngestionDataset(), []);

  const output = useMemo(
    () =>
      buildObservedPatternsOutput(
        dataset.normalizedFields,
        dataset.leverUnlocks,
      ),
    [dataset],
  );

  const hypothesisOutput = useMemo(
    () =>
      runDiagnosticHypothesisEngine({
        knowledge: knowledgeContext,
        normalizedFields: dataset.normalizedFields,
        leverUnlocks: dataset.leverUnlocks,
        eprScores,
      }),
    [knowledgeContext, dataset, eprScores],
  );

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
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Patterns → hypotheses → storyline (6A / 6B)"
        detail="Pattern features are descriptive. Hypotheses and executive storyline provide thematic margin framing — not recommendations or optimized prices."
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Observed Pricing Patterns"
      />

      <ExecutiveStorylinePanel result={storylineResult} />

      <DiagnosticHypothesesPanel
        output={hypothesisOutput}
        title="Underlying structural hypotheses"
        showArchitectureNote={false}
      />

      <Card>
        <p className="micro-label mb-2">Contextualized preview</p>
        <h3 className="section-title">
          {expectedStructureHeadline(
            knowledgeContext.archetypeId,
            knowledgeContext.pricingPosture,
          )}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {output.readinessSummary} · {PATTERN_FEATURE_COUNT} pattern features
          catalogued.
        </p>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Likely traffic-driving categories
            </dt>
            <dd className="mt-2 text-sm text-[var(--text-navy)]">
              {trafficCategories.join(", ") || "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Architecture-oriented monetization
            </dt>
            <dd className="mt-2 text-sm text-[var(--text-navy)]">
              {monetizationCategories.join(", ") || "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-[var(--text-navy)]">
          {suggestedKviConcentrationNote(knowledgeContext.archetypeId)}
        </p>
        {objectiveNotes.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {objectiveNotes.map((n) => (
              <li
                key={n}
                className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--text-navy)]"
              >
                {n}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <RoleInferenceSummaryCard
        context={knowledgeContext}
        title="Role context feeding hypotheses"
      />

      <BenchmarkConceptExplorer
        concepts={archetypeConcepts}
        title="Benchmark concept families (descriptive)"
      />

      <div>
        <p className="micro-label mb-3">Pattern feature inventory by lever</p>
        <div className="space-y-6">
          {sections.map((section) => (
            <PatternFeatureLeverCard key={section.leverKey} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
