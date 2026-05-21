"use client";

import { FinanceOverview } from "@/components/retailer-context/FinanceOverview";
import {
  formatNewsSourceLabel,
  resolveNewsArticleUrl,
} from "@/lib/newsLinks";
import { formatNewsDate, isRichPublicContext, relevanceLabel } from "@/lib/retailerContextDisplay";
import type { FinancePeer } from "@/types/finance-peers";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

type RetailerContextBriefProps = {
  enrichment: RetailerEnrichmentBundle;
  loading?: boolean;
  financePeers: FinancePeer[];
  onFinancePeersChange: (peers: FinancePeer[]) => void;
  onAddFinancePeer: (name: string) => void;
};

function LoadingSkeleton() {
  return (
    <div className="rc-brief space-y-6" aria-busy="true">
      <div className="rc-hero-card animate-pulse">
        <div className="h-4 w-32 rounded bg-[var(--surface-muted)]" />
        <div className="mt-4 h-8 w-64 rounded bg-[var(--surface-muted)]" />
        <div className="mt-4 h-16 w-full rounded bg-[var(--surface-muted)]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rc-finance-tile animate-pulse h-24" />
        ))}
      </div>
    </div>
  );
}

export function RetailerContextBrief({
  enrichment,
  loading = false,
  financePeers,
  onFinancePeersChange,
  onAddFinancePeer,
}: RetailerContextBriefProps) {
  if (loading) return <LoadingSkeleton />;

  const { context, companyProfile, news, meta } = enrichment;
  const displayName = companyProfile?.companyName ?? context.retailerName;
  const ticker = context.ticker;
  const rich = isRichPublicContext(enrichment);
  const isPublic =
    context.publicCompany || context.retailerType === "public_retailer";

  if (!rich) {
    return (
      <section className="rc-panel-card">
        <p className="rc-eyebrow">Retailer context</p>
        <h3 className="rc-card-title">{context.retailerName || "Retailer"}</h3>
        <p className="rc-card-lead mt-2">
          Limited public data available. You can still continue — set pricing
          posture and scope on the next step.
        </p>
      </section>
    );
  }

  return (
    <div className="rc-brief space-y-6">
      <header className="rc-hero-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="rc-eyebrow">Company profile</p>
            <h2 className="rc-hero-title">{displayName}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {isPublic && ticker ? (
                <>
                  <span className="font-medium text-[var(--accent)]">{ticker}</span>
                  {context.sector ? ` · ${context.sector}` : ""}
                  {companyProfile?.exchange ? ` · ${companyProfile.exchange}` : ""}
                </>
              ) : (
                "Private or limited public context"
              )}
            </p>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{meta.freshnessLabel}</p>
        </div>
        {(context.companyOverview || companyProfile?.description) && (
          <p className="mt-5 text-sm leading-relaxed text-[var(--text-navy)]">
            {context.companyOverview ?? companyProfile?.description}
          </p>
        )}
        {(context.bannerPortfolio || context.geography) && (
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {context.bannerPortfolio && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Banner portfolio
                </dt>
                <dd className="mt-1 text-[var(--text-navy)]">{context.bannerPortfolio}</dd>
              </div>
            )}
            {context.geography && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Geography
                </dt>
                <dd className="mt-1 text-[var(--text-navy)]">{context.geography}</dd>
              </div>
            )}
          </dl>
        )}
        {companyProfile?.profileUrl && (
          <p className="mt-4 text-xs">
            <a
              href={companyProfile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Company website ↗
            </a>
          </p>
        )}
      </header>

      <FinanceOverview
        enrichment={enrichment}
        companyLabel={displayName}
        financePeers={financePeers}
        onFinancePeersChange={onFinancePeersChange}
        onAddFinancePeer={onAddFinancePeer}
      />

      {news.length > 0 ? (
        <section className="rc-panel-card">
          <p className="rc-eyebrow">Recent signals</p>
          <h4 className="rc-section-title">Relevant headlines</h4>
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {news.slice(0, 6).map((item) => {
              const articleUrl = resolveNewsArticleUrl(item);
              const cardBody = (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                      {relevanceLabel(item.relevanceTag)}
                    </p>
                    <h5 className="rc-news-headline mt-2 text-sm font-semibold leading-snug text-[var(--text-navy)] group-hover:text-[var(--accent)] group-hover:underline decoration-[var(--accent)] decoration-1 underline-offset-2">
                      {item.headline}
                    </h5>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      <span className="font-medium text-[var(--text-navy)]">
                        {formatNewsSourceLabel(item.source)}
                      </span>
                      <span className="mx-1.5">·</span>
                      {formatNewsDate(item.publishedAt)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                      {item.summary}
                    </p>
                    {articleUrl ? (
                      <p className="rc-news-link-hint mt-3 text-xs font-medium text-[var(--accent)]">
                        Read article ↗
                      </p>
                    ) : null}
                </>
              );

              return (
                <li key={item.id}>
                  {articleUrl ? (
                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rc-news-card group block no-underline"
                    >
                      {cardBody}
                    </a>
                  ) : (
                    <article className="rc-news-card">{cardBody}</article>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
