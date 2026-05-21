"use client";

import { useMemo } from "react";
import {
  getArchetype,
  postureLabel,
} from "@/lib/archetypeContext";
import { inferRoles } from "@/lib/roleInference";
import { STRATEGIC_OBJECTIVES } from "@/types/knowledge-client";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type JourneyContextStripProps = {
  context: KnowledgeRegistryContext;
  stepLabel?: string;
};

/** Compact context ribbon — replaces framework-heavy strip in executive mode. */
export function JourneyContextStrip({
  context,
  stepLabel,
}: JourneyContextStripProps) {
  const archetype = getArchetype(context.archetypeId);
  const inference = useMemo(
    () =>
      inferRoles({
        archetypeId: context.archetypeId,
        pricingPosture: context.pricingPosture,
        strategicObjectives: context.strategicObjectives,
        categoryHint: context.categoryHint,
      }),
    [context],
  );

  const objectiveLabels = context.strategicObjectives
    .map((id) => STRATEGIC_OBJECTIVES.find((o) => o.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="context-strip">
      {stepLabel && (
        <p className="context-strip-step">{stepLabel}</p>
      )}
      <div className="context-strip-grid">
        <div>
          <p className="context-strip-label">Retailer type</p>
          <p className="context-strip-value">
            {archetype?.archetypeName ?? context.archetypeId}
          </p>
        </div>
        <div>
          <p className="context-strip-label">Pricing posture</p>
          <p className="context-strip-value">
            {postureLabel(context.pricingPosture)}
          </p>
        </div>
        <div>
          <p className="context-strip-label">Objectives</p>
          <p className="context-strip-value">
            {objectiveLabels.length > 0
              ? objectiveLabels.join(" · ")
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="context-strip-label">Category lens</p>
          <p className="context-strip-value">
            {inference.categorySuggestion.roleName}
            {context.categoryHint ? ` · ${context.categoryHint}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
