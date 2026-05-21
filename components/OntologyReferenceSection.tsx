"use client";

import { useState } from "react";
import { BenchmarkConceptExplorer } from "@/components/BenchmarkConceptExplorer";
import { CategoryRoleExplorer } from "@/components/CategoryRoleExplorer";
import { ItemRoleExplorer } from "@/components/ItemRoleExplorer";
import { benchmarkConceptsForArchetype } from "@/lib/archetypeContext";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

type OntologyReferenceSectionProps = {
  archetypeId: RetailerArchetypeId;
};

export function OntologyReferenceSection({
  archetypeId,
}: OntologyReferenceSectionProps) {
  const [open, setOpen] = useState(false);
  const concepts = benchmarkConceptsForArchetype(archetypeId);

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-[var(--surface-muted)]"
      >
        <div>
          <p className="micro-label">Reference library</p>
          <p className="section-title">Ontology & benchmark concept catalog</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Expand to browse category roles, item roles, and {concepts.length}{" "}
            benchmark concepts for this archetype.
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-[var(--accent)]">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>
      {open && (
        <div className="space-y-6 border-t border-[var(--border)] bg-[var(--app-bg)] p-6">
          <BenchmarkConceptExplorer
            concepts={concepts}
            title="Benchmark concept families"
          />
          <CategoryRoleExplorer highlightArchetype={archetypeId} />
          <ItemRoleExplorer />
        </div>
      )}
    </div>
  );
}
