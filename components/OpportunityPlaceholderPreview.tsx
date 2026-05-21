import { Card } from "@/components/Card";
import {
  ILLUSTRATIVE_OPPORTUNITY_RANGES,
  POC_DISCLAIMER,
} from "@/data/presentationPlaceholders";
import type { LeverKey } from "@/types/diagnostic-output";

type OpportunityPlaceholderPreviewProps = {
  selectedLeverKeys?: Set<LeverKey>;
  revenueInScopeLabel?: string;
};

export function OpportunityPlaceholderPreview({
  selectedLeverKeys,
  revenueInScopeLabel = "Not set",
}: OpportunityPlaceholderPreviewProps) {
  const rows = selectedLeverKeys
    ? ILLUSTRATIVE_OPPORTUNITY_RANGES.filter((r) =>
        selectedLeverKeys.has(r.leverKey),
      )
    : ILLUSTRATIVE_OPPORTUNITY_RANGES;

  return (
    <Card>
      <p className="micro-label mb-2">Opportunity preview</p>
      <h3 className="section-title">Illustrative opportunity ranges</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{POC_DISCLAIMER}</p>
      <p className="mt-2 text-sm font-medium text-[var(--text-navy)]">
        Revenue in scope (denominator): {revenueInScopeLabel}
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="pb-3 pr-4 font-semibold">Lever</th>
              <th className="pb-3 pr-4 font-semibold">Theme</th>
              <th className="pb-3 pr-4 font-semibold">Low (illustrative)</th>
              <th className="pb-3 pr-4 font-semibold">Base (illustrative)</th>
              <th className="pb-3 font-semibold">High (illustrative)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.leverKey}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="py-3 pr-4 font-medium text-[var(--text-navy)]">
                  {row.label}
                </td>
                <td className="py-3 pr-4 text-[var(--text-muted)]">
                  {row.theme}
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-[var(--text-muted)]">
                  {row.lowBps}
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-[var(--text-navy)]">
                  {row.baseBps}
                </td>
                <td className="py-3 font-mono text-xs text-[var(--text-muted)]">
                  {row.highBps}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs italic text-[var(--text-muted)]">
        Dollar amounts are not computed. Ranges are representative placeholders
        for executive review of cockpit layout only.
      </p>
    </Card>
  );
}
