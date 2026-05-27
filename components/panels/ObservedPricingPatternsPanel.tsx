"use client";



import { useMemo } from "react";

import { PatternFeatureLeverCard } from "@/components/PatternFeatureLeverCard";

import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";

import { buildObservedPatternsOutput } from "@/lib/patternFeatureBuilder";

import { filterPatternSectionsForConsultant } from "@/lib/executiveOutputPolish";

import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

import type { EprScores } from "@/types/ui";

import type { CanonicalFieldKey } from "@/types/upload-schema";



type ObservedPricingPatternsPanelProps = {

  knowledgeContext: KnowledgeRegistryContext;

  eprScores: EprScores;

  embedded?: boolean;

  consultantMode?: boolean;

  normalizedFields?: CanonicalFieldKey[];

  promoMarkdownEligible?: boolean;

};



export function ObservedPricingPatternsPanel({

  knowledgeContext,

  eprScores: _eprScores,

  embedded = false,

  consultantMode = false,

  normalizedFields: normalizedFieldsProp,

  promoMarkdownEligible = false,

}: ObservedPricingPatternsPanelProps) {

  const dataset = useMemo(() => buildPlaceholderIngestionDataset(), []);

  const normalizedFields = normalizedFieldsProp ?? dataset.normalizedFields;



  const output = useMemo(

    () =>

      buildObservedPatternsOutput(

        normalizedFields,

        dataset.leverUnlocks,

      ),

    [normalizedFields, dataset],

  );



  const present = useMemo(() => new Set(normalizedFields), [normalizedFields]);



  const sections = useMemo(() => {

    const all = [

      output.kviPatterns,

      output.architecturePatterns,

      output.zoningPatterns,

      output.promotionPatterns,

      output.markdownPatterns,

    ];

    if (!consultantMode) return [];

    return filterPatternSectionsForConsultant(

      all,

      present,

      promoMarkdownEligible,

    );

  }, [output, consultantMode, present, promoMarkdownEligible]);



  if (!consultantMode && embedded) {

    return null;

  }



  if (consultantMode && sections.length === 0) {

    return (

      <p className="text-sm text-[var(--text-muted)]">

        No additional pattern inventories apply to the current upload scope.

      </p>

    );

  }



  if (embedded || consultantMode) {

    return (

      <div className="space-y-4">

        <p className="text-sm text-[var(--text-muted)]">

          Lever inventories for fields present in scope. Feature values are not

          computed in this build.

        </p>

        <div className="space-y-4">

          {sections.map((section) => (

            <PatternFeatureLeverCard

              key={section.leverKey}

              section={section}

              variant="compact"

            />

          ))}

        </div>

      </div>

    );

  }



  return null;

}

