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
  strategicContext: string;
  onPricingPostureChange: (value: PricingPosture) => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onStrategicContextChange: (value: string) => void;
};

const selectClassName =
  "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-navy)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

const textareaClassName =
  "w-full rounded-md border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-navy)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

export function StrategicContextCard({
  pricingPosture,
  retailerFormat,
  strategicContext,
  onPricingPostureChange,
  onRetailerFormatChange,
  onStrategicContextChange,
}: StrategicContextCardProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Strategic context</p>
      <h3 className="section-title">Strategic Context</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Archetype, pricing posture, and objectives are configured in the Pricing
        Knowledge Registry above. Format and notes below complement workflow
        context.
      </p>
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
