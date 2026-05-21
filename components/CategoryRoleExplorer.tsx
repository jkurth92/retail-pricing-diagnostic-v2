import { Card } from "@/components/Card";
import { CATEGORY_ROLES } from "@/data/categoryRoles";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

type CategoryRoleExplorerProps = {
  highlightArchetype?: RetailerArchetypeId;
  limit?: number;
};

export function CategoryRoleExplorer({
  highlightArchetype,
  limit,
}: CategoryRoleExplorerProps) {
  const roles = limit
    ? CATEGORY_ROLES.slice(0, limit)
    : highlightArchetype
      ? CATEGORY_ROLES.filter((r) =>
          r.retailerContexts.includes(highlightArchetype),
        )
      : CATEGORY_ROLES;

  return (
    <Card>
      <p className="micro-label mb-2">Category roles</p>
      <h3 className="section-title">Category role ontology</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Strategic category roles — not SKU assignments. No performance verdict.
      </p>
      <ul className="mt-4 space-y-4">
        {roles.map((role) => (
          <li
            key={role.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
          >
            <h4 className="text-sm font-semibold text-[var(--text-navy)]">
              {role.roleName}
            </h4>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {role.description}
            </p>
            <p className="mt-2 text-xs text-[var(--text-navy)]">
              <span className="font-medium">Expected behavior:</span>{" "}
              {role.expectedBehavior}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Examples: {role.commonCategories.slice(0, 4).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
