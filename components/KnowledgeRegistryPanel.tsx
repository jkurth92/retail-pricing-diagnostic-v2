"use client";

import { useMemo } from "react";
import { Disclosure } from "@/components/Disclosure";
import { OntologyReferenceSection } from "@/components/OntologyReferenceSection";
import { RetailerArchetypeCard } from "@/components/RetailerArchetypeCard";
import { RoleInferencePreview } from "@/components/RoleInferencePreview";
import {
  getArchetype,
  objectivesAdjustEmphasis,
} from "@/lib/archetypeContext";
import { RETAILER_ARCHETYPES } from "@/data/retailerArchetypes";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RetailerArchetypeId, PricingPosture } from "@/types/retailer-archetypes";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import { STRATEGIC_OBJECTIVES } from "@/types/knowledge-client";
import { KNOWLEDGE_PRICING_POSTURES } from "@/data/retailerArchetypes";
import { Card } from "@/components/Card";

const selectClassName =
  "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-navy)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

type KnowledgeRegistryPanelProps = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  onArchetypeChange: (id: RetailerArchetypeId) => void;
  onPostureChange: (posture: PricingPosture) => void;
  onToggleObjective: (id: StrategicObjectiveId) => void;
  onCategoryHintChange: (value: string) => void;
  compact?: boolean;
};

export function KnowledgeRegistryPanel({
  archetypeId,
  pricingPosture,
  strategicObjectives,
  categoryHint,
  onArchetypeChange,
  onPostureChange,
  onToggleObjective,
  onCategoryHintChange,
  compact = false,
}: KnowledgeRegistryPanelProps) {
  const archetype = getArchetype(archetypeId);
  const objectiveNotes = useMemo(
    () => objectivesAdjustEmphasis(strategicObjectives),
    [strategicObjectives],
  );

  const context: KnowledgeRegistryContext = {
    archetypeId,
    pricingPosture,
    strategicObjectives,
    categoryHint,
  };

  const inputsBlock = (
    <>
        {!compact && (
          <>
            <p className="micro-label mb-2">Retailer profile inputs</p>
            <h3 className="section-title">Archetype & objectives</h3>
          </>
        )}
        {compact && (
          <h3 className="text-base font-semibold text-[var(--text-navy)] mb-4">
            Archetype & objectives
          </h3>
        )}
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Shapes the pricing profile and structural themes in the readout.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div>
            <label
              htmlFor="archetype-select"
              className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
            >
              Retailer archetype
            </label>
            <select
              id="archetype-select"
              value={archetypeId}
              onChange={(e) =>
                onArchetypeChange(e.target.value as RetailerArchetypeId)
              }
              className={selectClassName}
            >
              {RETAILER_ARCHETYPES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.archetypeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="knowledge-posture"
              className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
            >
              Pricing posture
            </label>
            <select
              id="knowledge-posture"
              value={pricingPosture}
              onChange={(e) =>
                onPostureChange(e.target.value as PricingPosture)
              }
              className={selectClassName}
            >
              {KNOWLEDGE_PRICING_POSTURES.map((p) => (
                <option key={p} value={p}>
                  {p === "HiLo" ? "Hi-Lo" : p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category-hint-registry"
              className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
            >
              Example category
            </label>
            <input
              id="category-hint-registry"
              type="text"
              value={categoryHint}
              onChange={(e) => onCategoryHintChange(e.target.value)}
              placeholder="Laundry detergent"
              className={selectClassName}
            />
          </div>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-[var(--text-navy)]">
            Strategic objectives
          </p>
          <div className="flex flex-wrap gap-2">
            {STRATEGIC_OBJECTIVES.map((obj) => {
              const selected = strategicObjectives.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => onToggleObjective(obj.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-navy)]"
                      : "border-[var(--border)] bg-white text-[var(--text-muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {obj.label}
                </button>
              );
            })}
          </div>
        </div>
        {objectiveNotes.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-md bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-muted)]">
            {objectiveNotes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        )}
    </>
  );

  return (
    <div className="space-y-6">
      {compact ? <div>{inputsBlock}</div> : <Card>{inputsBlock}</Card>}

      {!compact && archetype && (
        <RetailerArchetypeCard
          archetype={archetype}
          selectedPosture={pricingPosture}
          compact
        />
      )}

      <Disclosure
        title="View role structure preview"
        summary="How category and item roles are inferred for this retailer"
        variant="subtle"
      >
        <RoleInferencePreview context={context} />
      </Disclosure>

      <Disclosure
        title="View reference definitions"
        summary="Role and benchmark reference material"
        variant="subtle"
      >
        <OntologyReferenceSection archetypeId={archetypeId} />
      </Disclosure>
    </div>
  );
}
