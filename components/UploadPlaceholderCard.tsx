import { Card } from "@/components/Card";

const UPLOAD_ZONES = [
  {
    title: "Price file",
    description: "Observed shelf or list prices by SKU and store or zone.",
  },
  {
    title: "Product master",
    description: "SKU attributes, categories, brands, and pack sizes.",
  },
  {
    title: "Store / zone file",
    description: "Store or zone mapping for geographic pricing analysis.",
  },
  {
    title: "Optional context documents",
    description: "Strategy decks, prior diagnostics, or category briefs.",
  },
];

export function UploadPlaceholderCard() {
  return (
    <Card>
      <p className="micro-label mb-2">Client uploads</p>
      <h3 className="section-title">Client Uploads</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Uploads will later power observed pricing diagnostics. File parsing and
        backend storage are not implemented in Step 1.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {UPLOAD_ZONES.map((zone) => (
          <div
            key={zone.title}
            className="flex min-h-[120px] flex-col justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--app-bg)] px-5 py-4"
          >
            <p className="text-sm font-medium text-[var(--text-navy)]">
              {zone.title}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {zone.description}
            </p>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Upload placeholder — requires alignment before implementation.
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
