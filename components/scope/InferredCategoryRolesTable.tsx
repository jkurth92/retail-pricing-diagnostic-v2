"use client";

import { CATEGORY_ROLE_OPTIONS } from "@/lib/inferCategoryRoles";
import type { InferredCategoryRow } from "@/types/category-scope";
import type { CategoryRoleId } from "@/types/role-inference";

type InferredCategoryRolesTableProps = {
  rows: InferredCategoryRow[];
  onRowsChange: (rows: InferredCategoryRow[]) => void;
  retailerName?: string;
};

export function InferredCategoryRolesTable({
  rows,
  onRowsChange,
  retailerName,
}: InferredCategoryRolesTableProps) {
  const updateRow = (id: string, patch: Partial<InferredCategoryRow>) => {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => {
    onRowsChange(rows.filter((r) => r.id !== id));
  };

  const addRow = () => {
    onRowsChange([
      ...rows,
      {
        id: `cat-row-${Date.now()}`,
        category: "",
        roleId: "basket_builder",
      },
    ]);
  };

  return (
    <section className="scope-category-table-wrap">
      <h3 className="text-lg font-semibold tracking-tight text-[var(--text-navy)]">
        Inferred category roles
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {retailerName
          ? `Suggested commercial roles for ${retailerName} — edit to match your scope.`
          : "Suggested commercial roles for this retailer — edit to match your scope."}
      </p>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <table className="scope-category-table w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <th className="px-4 py-3 font-semibold text-[var(--text-navy)]">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--text-navy)]">
                Suggested role
              </th>
              <th className="w-12 px-2 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={row.category}
                    onChange={(e) => updateRow(row.id, { category: e.target.value })}
                    placeholder="Category name"
                    className="w-full rounded-md border border-[var(--border)] px-2 py-1.5 text-sm"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={row.roleId}
                    onChange={(e) =>
                      updateRow(row.id, {
                        roleId: e.target.value as CategoryRoleId,
                      })
                    }
                    className="w-full rounded-md border border-[var(--border)] px-2 py-1.5 text-sm"
                  >
                    {CATEGORY_ROLE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <button
                    type="button"
                    aria-label={`Remove ${row.category || "category"}`}
                    onClick={() => removeRow(row.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-navy)]"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
      >
        + Add category
      </button>
    </section>
  );
}
