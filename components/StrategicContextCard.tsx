import { Card } from "@/components/Card";
import {
  PRICING_POSTURES,
  RETAILER_FORMATS,
  type PricingPosture,
  type RetailerFormat,
} from "@/types/ui";

type StrategicContextCardProps = {
  pricingPosture: PricingPosture;
  retailerFormat: RetailerFormat;
  competitorSet: string;
  strategicContext: string;
  onPricingPostureChange: (value: PricingPosture) => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onCompetitorSetChange: (value: string) => void;
  onStrategicContextChange: (value: string) => void;
};

const selectClassName =
  "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-navy)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

const textareaClassName =
  "w-full rounded-md border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-navy)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

export function StrategicContextCard({
  pricingPosture,
  retailerFormat,
  competitorSet,
  strategicContext,
  onPricingPostureChange,
  onRetailerFormatChange,
  onCompetitorSetChange,
  onStrategicContextChange,
}: StrategicContextCardProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Strategic context</p>
      <h3 className="section-title">Strategic Context</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="pricing-posture"
            className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
          >
            Pricing posture
          </label>
          <select
            id="pricing-posture"
            value={pricingPosture}
            onChange={(e) =>
              onPricingPostureChange(e.target.value as PricingPosture)
            }
            className={selectClassName}
          >
            {PRICING_POSTURES.map((posture) => (
              <option key={posture} value={posture}>
                {posture}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="retailer-format"
            className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
          >
            Retailer format
          </label>
          <select
            id="retailer-format"
            value={retailerFormat}
            onChange={(e) =>
              onRetailerFormatChange(e.target.value as RetailerFormat)
            }
            className={selectClassName}
          >
            {RETAILER_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="competitor-set"
          className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
        >
          Competitor set
        </label>
        <textarea
          id="competitor-set"
          rows={3}
          value={competitorSet}
          onChange={(e) => onCompetitorSetChange(e.target.value)}
          placeholder="List primary competitors and any relevant positioning notes."
          className={textareaClassName}
        />
      </div>
      <div className="mt-6">
        <label
          htmlFor="strategic-context"
          className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
        >
          Strategic context
        </label>
        <textarea
          id="strategic-context"
          rows={4}
          value={strategicContext}
          onChange={(e) => onStrategicContextChange(e.target.value)}
          placeholder="Describe pricing priorities, constraints, and diagnostic focus areas."
          className={textareaClassName}
        />
      </div>
    </Card>
  );
}
