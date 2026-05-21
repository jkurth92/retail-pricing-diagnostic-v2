"use client";

import { getArchetype, listArchetypes, postureLabel } from "@/lib/archetypeContext";
import { KNOWLEDGE_PRICING_POSTURES } from "@/data/retailerArchetypes";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

type ScopeAssumptionsCardProps = {
  archetypeId: RetailerArchetypeId;
  suggestedArchetypeId: RetailerArchetypeId | null;
  knowledgePosture: PricingPosture;
  suggestedPosture: PricingPosture | null;
  onArchetypeChange: (id: RetailerArchetypeId) => void;
  onKnowledgePostureChange: (posture: PricingPosture) => void;
};

export function ScopeAssumptionsCard({
  archetypeId,
  suggestedArchetypeId,
  knowledgePosture,
  suggestedPosture,
  onArchetypeChange,
  onKnowledgePostureChange,
}: ScopeAssumptionsCardProps) {
  const archetype = getArchetype(archetypeId);
  const showArchetypeSuggestion =
    suggestedArchetypeId && suggestedArchetypeId !== archetypeId;
  const showPostureSuggestion =
    suggestedPosture && suggestedPosture !== knowledgePosture;

  return (
    <section className="scope-assumptions">
      <h3 className="text-base font-semibold text-[var(--text-navy)]">
        Review assumptions
      </h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Inferred from your retailer profile — adjust if needed.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium text-[var(--text-navy)]">
              Retailer type
            </label>
            {showArchetypeSuggestion && (
              <button
                type="button"
                className="text-xs font-medium text-[var(--accent)] hover:underline"
                onClick={() => onArchetypeChange(suggestedArchetypeId)}
              >
                Apply suggested ({getArchetype(suggestedArchetypeId)?.archetypeName})
              </button>
            )}
          </div>
          <select
            value={archetypeId}
            onChange={(e) =>
              onArchetypeChange(e.target.value as RetailerArchetypeId)
            }
            className="mt-2 w-full max-w-md rounded-md border border-[var(--border)] px-3 py-2 text-sm"
          >
            {listArchetypes().map((a) => (
              <option key={a.id} value={a.id}>
                {a.archetypeName}
              </option>
            ))}
          </select>
          {archetype && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {archetype.description}
            </p>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium text-[var(--text-navy)]">
              Pricing posture
            </label>
            {showPostureSuggestion && (
              <button
                type="button"
                className="text-xs font-medium text-[var(--accent)] hover:underline"
                onClick={() => onKnowledgePostureChange(suggestedPosture)}
              >
                Apply suggested ({postureLabel(suggestedPosture)})
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {KNOWLEDGE_PRICING_POSTURES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onKnowledgePostureChange(p)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  knowledgePosture === p
                    ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-navy)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                }`}
              >
                {postureLabel(p)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
