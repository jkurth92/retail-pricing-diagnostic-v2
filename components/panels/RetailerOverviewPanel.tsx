import { PlaceholderPanel } from "@/components/PlaceholderPanel";

const PLACEHOLDERS = [
  {
    title: "Public company data",
    description:
      "Financials, store count, and segment mix from external sources.",
  },
  {
    title: "News and headlines",
    description: "Recent pricing, promo, and competitive news.",
  },
  {
    title: "Peer comparison",
    description: "Benchmark peer set and relative positioning.",
  },
  {
    title: "Supplemental documents",
    description: "10-K excerpts, investor presentations, and analyst notes.",
  },
];

export function RetailerOverviewPanel() {
  return (
    <div className="space-y-6">
      <PlaceholderPanel
        title="Retailer Overview"
        description="External retailer intelligence will populate this view after integrations are approved."
        note="External data integrations will be added later."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PLACEHOLDERS.map((item) => (
          <div
            key={item.title}
            className="card-surface px-5 py-6"
          >
            <h4 className="text-sm font-semibold text-[var(--text-navy)]">
              {item.title}
            </h4>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {item.description}
            </p>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Requires alignment before implementation.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
