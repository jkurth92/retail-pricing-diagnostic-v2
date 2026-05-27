"use client";

import { refinementModeLabel } from "@/lib/refinementState";
import type { RefinementPresentationMeta } from "@/types/refinement";

type RefinementStatusBannerProps = {
  meta: RefinementPresentationMeta;
};

export function RefinementStatusBanner({ meta }: RefinementStatusBannerProps) {
  if (!meta.isUserRefined) return null;

  return (
    <div
      className={`refinement-status-banner mb-4 rounded-lg border px-4 py-3 ${
        meta.mode === "preview"
          ? "border-amber-300/80 bg-amber-50"
          : "border-[var(--accent-mid)]/40 bg-[var(--accent-light)]/30"
      }`}
      role="status"
    >
      <p className="m-0 text-sm font-semibold text-[var(--text-navy)]">
        {refinementModeLabel(meta.mode)}
      </p>
      <p className="mt-1 mb-0 text-xs text-[var(--text-muted)]">
        {meta.mode === "preview"
          ? "Preview only — base diagnostic is unchanged until you apply refinements."
          : "User-refined interpretation — underlying evidence and sizing are unchanged."}
      </p>
      {meta.badges.length > 0 && (
        <ul className="refinement-badge-list mt-3 flex flex-wrap gap-2 p-0">
          {meta.badges.map((label) => (
            <li
              key={label}
              className="list-none rounded-full border border-[var(--border)] bg-white px-2.5 py-0.5 text-[0.6875rem] font-medium text-[var(--text-navy)]"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
