import { Card } from "@/components/Card";
import { postureLabel } from "@/lib/archetypeContext";
import type { RetailerArchetype } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";

type RetailerArchetypeCardProps = {
  archetype: RetailerArchetype;
  selectedPosture?: PricingPosture;
  compact?: boolean;
};

export function RetailerArchetypeCard({
  archetype,
  selectedPosture,
  compact = false,
}: RetailerArchetypeCardProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Retailer archetype</p>
      <h3 className="section-title">{archetype.archetypeName}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{archetype.description}</p>
      {!compact && (
        <>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Typical pricing postures
            </p>
            <p className="mt-1 text-sm text-[var(--text-navy)]">
              {archetype.pricingPostures.map(postureLabel).join(" · ")}
              {selectedPosture && (
                <span className="ml-2 font-medium text-[var(--accent)]">
                  Selected: {postureLabel(selectedPosture)}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Expected category roles
            </p>
            <p className="mt-1 text-sm text-[var(--text-navy)]">
              {archetype.expectedCategoryRoles.join(", ")}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Expected architecture patterns
            </p>
            <ul className="mt-1 list-disc pl-5 text-sm text-[var(--text-navy)]">
              {archetype.expectedArchitecturePatterns.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs italic text-[var(--text-muted)]">
            {archetype.notes}
          </p>
        </>
      )}
    </Card>
  );
}
