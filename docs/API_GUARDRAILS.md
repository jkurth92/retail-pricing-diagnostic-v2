# API Guardrails (Step 9)

## Enrichment only

External APIs may **only** populate:

- `RetailerContext`
- `CompanyProfile`
- `NewsSummary`
- Strategic overview suggestions

## Never use APIs for

- Pricing recommendations or optimization
- Competitor matching or scraping
- Pricing rules or thresholds
- Opportunity sizing or dollar math
- Elasticity or live diagnostic calculations
- Hypothesis ranking or storyline math

## Precedence

1. **Manual overrides** (`RetailerContextEditor`)
2. Live API response (when configured)
3. Curated reference data (deterministic, documented)
4. Alias / inferred hints

## Failure tolerance

API errors, missing tickers, and private retailers must **not** block the workflow. Status labels: `unavailable`, `partial`, `available`, `stale`.

## Deterministic mapping

Field mapping from API → UI types is explicit in `contextResolver.ts` and `retailerProfileApi.ts`. No generative or black-box interpretation of API payloads.

## Secrets

- `FINNHUB_API_KEY` only on the server (API route)
- Never expose keys to the client bundle
- Do not commit `.env` or API keys to Git

## Competitors

No API calls for competitor sets, peer pricing, or market matching. Peer count in scope is user-selected seed data only.
