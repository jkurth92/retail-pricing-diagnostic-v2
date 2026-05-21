import { Card } from "@/components/Card";
import { ITEM_ROLES } from "@/data/itemRoles";

export function ItemRoleExplorer() {
  return (
    <Card>
      <p className="micro-label mb-2">Item roles</p>
      <h3 className="section-title">Item role ontology</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Pricing roles at item level — illustrative mix only until client taxonomy
        aligns.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ITEM_ROLES.map((role) => (
          <div
            key={role.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3"
          >
            <h4 className="text-sm font-semibold text-[var(--text-navy)]">
              {role.roleName}
            </h4>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {role.description}
            </p>
            <p className="mt-2 text-xs text-[var(--text-navy)]">
              Visibility: {role.visibilityLevel} · Architecture:{" "}
              {role.architectureImportance}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
