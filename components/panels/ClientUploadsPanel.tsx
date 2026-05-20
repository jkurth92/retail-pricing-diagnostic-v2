import { Card } from "@/components/Card";
import { DataReadinessPanel } from "@/components/DataReadinessPanel";

const UPLOAD_PLACEHOLDERS = [
  {
    title: "Price file",
    purpose: "Observed shelf or list prices by SKU and store or zone.",
    exampleFields: "sku_id, store_id, zone, list_price, observed_date",
  },
  {
    title: "Product master",
    purpose: "SKU attributes for matching and category rollups.",
    exampleFields: "sku_id, upc, brand, category, subcategory, pack_size",
  },
  {
    title: "Store / zone file",
    purpose: "Geographic and channel mapping for zoning analysis.",
    exampleFields: "store_id, zone, region, banner, format",
  },
  {
    title: "Sales / volume file",
    purpose: "Unit velocity and revenue weighting for opportunity context.",
    exampleFields: "sku_id, store_id, units, revenue, period",
  },
  {
    title: "Margin / cost file",
    purpose: "Unit economics for margin and markdown diagnostics.",
    exampleFields: "sku_id, unit_cost, margin_pct, period",
  },
  {
    title: "Promotion file",
    purpose: "Promotional events, depths, and mechanics.",
    exampleFields: "sku_id, promo_start, promo_end, promo_price, mechanic",
  },
  {
    title: "Markdown file",
    purpose: "Clearance and markdown cadence signals.",
    exampleFields: "sku_id, markdown_date, markdown_price, inventory_flag",
  },
  {
    title: "Optional context documents",
    purpose: "Strategy decks, prior diagnostics, or category briefs.",
    exampleFields: "document_type, effective_date, notes",
  },
];

export function ClientUploadsPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <p className="micro-label mb-2">Evidence intake</p>
        <h3 className="section-title">Client Uploads</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Client uploads will later provide the observed pricing evidence used by
          the diagnostic engine. No files are parsed in this build.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {UPLOAD_PLACEHOLDERS.map((upload) => (
          <div
            key={upload.title}
            className="card-surface flex min-h-[180px] flex-col p-5"
          >
            <p className="text-sm font-semibold text-[var(--text-navy)]">
              {upload.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              {upload.purpose}
            </p>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text-navy)]">
                Example fields (future):
              </span>{" "}
              {upload.exampleFields}
            </p>
            <div className="mt-auto pt-4">
              <p className="text-xs font-medium text-[var(--text-navy)]">
                Status: Not uploaded
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Upload parsing will be implemented after schema alignment.
              </p>
            </div>
          </div>
        ))}
      </div>
      <DataReadinessPanel />
    </div>
  );
}
