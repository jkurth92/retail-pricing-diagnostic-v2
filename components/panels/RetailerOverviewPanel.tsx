"use client";

import { Card } from "@/components/Card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { Disclosure } from "@/components/Disclosure";
import { EnrichmentStatusBadge } from "@/components/EnrichmentStatusBadge";
import { RetailerContextEditor } from "@/components/RetailerContextEditor";
import { formatStrategicContextSummary } from "@/lib/strategicContextResolver";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

type RetailerOverviewPanelProps = {
  enrichment: RetailerEnrichmentBundle;
  manualTicker: string;
  onManualTickerChange: (value: string) => void;
  onOverridesChange: (overrides: RetailerEnrichmentBundle["manualOverrides"]) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  embedded?: boolean;
};

function publicPrivateLabel(ctx: RetailerEnrichmentBundle["context"]): string {
  if (ctx.publicCompany && ctx.ticker) return `Public · ${ctx.ticker}`;
  if (ctx.retailerType === "private_retailer") return "Private retailer";
  if (ctx.retailerType === "subsidiary_banner") return "Subsidiary / banner";
  return "Status unknown";
}

export function RetailerOverviewPanel({
  enrichment,
  manualTicker,
  onManualTickerChange,
  onOverridesChange,
  onRefresh,
  isRefreshing = false,
  embedded = false,
}: RetailerOverviewPanelProps) {
  const { context, companyProfile, news, meta, suggestions } = enrichment;
  const displayName = context.retailerName.trim() || "Not selected";
  const strategicSummary = formatStrategicContextSummary(suggestions);

  const headlineSection = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3
            className={
              embedded
                ? "text-base font-semibold text-[var(--text-navy)]"
                : "text-2xl font-semibold tracking-tight text-[var(--text-navy)]"
            }
          >
            {companyProfile?.companyName ?? displayName}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {publicPrivateLabel(context)}
            {context.sector ? ` · ${context.sector}` : ""}
          </p>
        </div>
        <EnrichmentStatusBadge meta={meta} />
      </div>
      {context.companyOverview && (
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-navy)]">
          {context.companyOverview}
        </p>
      )}
    </>
  );

  const metrics = [
    { label: "Revenue", value: context.revenue ?? companyProfile?.revenueDisplay },
    { label: "Market cap", value: context.marketCap ?? companyProfile?.marketCapDisplay },
    { label: "Store count", value: context.storeCount ?? companyProfile?.storeCountDisplay },
    { label: "Geography", value: context.geography ?? companyProfile?.country },
  ].filter((m) => m.value);

  if (embedded) {
    return (
      <div className="space-y-4">
        {headlineSection}
        {metrics.length > 0 && (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {metrics.slice(0, 4).map((m) => (
              <div key={m.label}>
                <dt className="text-xs uppercase text-[var(--text-muted)]">
                  {m.label}
                </dt>
                <dd className="mt-0.5 font-medium text-[var(--text-navy)]">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      <DiagnosticSection
        eyebrow="Retailer overview"
        title={displayName}
        lead="Public company context and recent signals for onboarding — enrichment only, not used in diagnostic calculations."
      >
        {headlineSection}
      </DiagnosticSection>

      {metrics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {m.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--text-navy)]">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {(context.bannerPortfolio || context.geography) && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Format & footprint
          </p>
          <dl className="mt-3 space-y-2 text-sm text-[var(--text-navy)]">
            {context.bannerPortfolio && (
              <div>
                <dt className="text-[var(--text-muted)]">Banner portfolio</dt>
                <dd>{context.bannerPortfolio}</dd>
              </div>
            )}
            {context.geography && (
              <div>
                <dt className="text-[var(--text-muted)]">Geography</dt>
                <dd>{context.geography}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Strategic context
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-navy)]">
          {strategicSummary}
        </p>
        {(suggestions.suggestedArchetypeId || suggestions.suggestedPosture) && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Suggested setup (optional):{" "}
            {suggestions.suggestedArchetypeId &&
              `archetype ${suggestions.suggestedArchetypeId}`}
            {suggestions.suggestedArchetypeId && suggestions.suggestedPosture && " · "}
            {suggestions.suggestedPosture &&
              `posture ${suggestions.suggestedPosture}`}
          </p>
        )}
      </Card>

      {news.length > 0 ? (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Recent headlines
          </p>
          <ul className="mt-4 space-y-4">
            {news.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium text-[var(--text-navy)]">
                  {item.headline}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {item.source} · {item.relevanceTag.replace(/_/g, " ")}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">
          No headlines available — continue with manual strategic context.
        </p>
      )}

      <Disclosure
        title="View enrichment sources"
        summary={`Profile: ${meta.profileSource.replace(/_/g, " ")} · News: ${meta.newsSource.replace(/_/g, " ")}`}
        variant="subtle"
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Profile status: {meta.profileStatus}</li>
          <li>News status: {meta.newsStatus}</li>
          <li>Lookup confidence: {enrichment.lookup.confidence}</li>
          {enrichment.lookup.matchedAlias && (
            <li>Matched alias: {enrichment.lookup.matchedAlias}</li>
          )}
          <li>Not used for opportunity sizing, rules, or competitor matching.</li>
        </ul>
      </Disclosure>

      <RetailerContextEditor
        enrichment={enrichment}
        manualTicker={manualTicker}
        onManualTickerChange={onManualTickerChange}
        onOverridesChange={onOverridesChange}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
