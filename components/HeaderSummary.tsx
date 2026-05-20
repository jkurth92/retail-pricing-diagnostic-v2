import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";

type HeaderSummaryProps = {
  retailerDisplay: string;
};

export function HeaderSummary({ retailerDisplay }: HeaderSummaryProps) {
  return (
    <Card className="mb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-navy)]">
            Retail Pricing Diagnostic
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Analyze pricing, promotions, and markdown opportunity using client
            evidence and benchmark interpretation.
          </p>
        </div>
        <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          <StatusPill label="Retailer" value={retailerDisplay} />
          <StatusPill label="Scope" value="All categories" />
          <StatusPill label="Mode" value="Client-upload driven" />
          <StatusPill label="Status" value="Ready" />
        </div>
      </div>
    </Card>
  );
}
