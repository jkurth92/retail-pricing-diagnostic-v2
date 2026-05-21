import { Card } from "@/components/Card";

type RetailerInputCardProps = {
  retailerName: string;
  onRetailerNameChange: (value: string) => void;
  onPopulate: () => void;
  loading?: boolean;
};

export function RetailerInputCard({
  retailerName,
  onRetailerNameChange,
  onPopulate,
  loading = false,
}: RetailerInputCardProps) {
  return (
    <Card className="rc-search-card">
      <p className="micro-label mb-2">Start here</p>
      <h3 className="section-title">Search retailer</h3>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={retailerName}
          onChange={(e) => onRetailerNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && retailerName.trim()) onPopulate();
          }}
          placeholder="e.g. Target, Walmart, Kroger"
          className="flex-1 rounded-md border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-navy)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={onPopulate}
          disabled={!retailerName.trim() || loading}
          className="shrink-0 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Building profile…" : "Build retailer profile"}
        </button>
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        We enrich the profile automatically — archetype, posture, category
        focus, and public context when available. Review and lightly edit; no
        framework configuration required.
      </p>
    </Card>
  );
}
