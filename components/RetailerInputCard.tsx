import { Card } from "@/components/Card";

type RetailerInputCardProps = {
  retailerName: string;
  onRetailerNameChange: (value: string) => void;
  onPopulate: () => void;
};

export function RetailerInputCard({
  retailerName,
  onRetailerNameChange,
  onPopulate,
}: RetailerInputCardProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Start here</p>
      <h3 className="section-title">Retailer name</h3>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={retailerName}
          onChange={(e) => onRetailerNameChange(e.target.value)}
          placeholder="Enter retailer name"
          className="flex-1 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-navy)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={onPopulate}
          className="shrink-0 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          Build retailer profile
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
