# Retailer Context API Enrichment (Step 9)

## Purpose

Step 9 enriches the **retailer overview** and **executive narrative** with public company context when available. It improves onboarding and strategic framing without changing diagnostic engines.

## What enrichment provides

- Ticker resolution from retailer name (`data/retailerAliases.ts`)
- Company profile (revenue, market cap, store count, sector, description)
- Recent headlines with relevance tags
- Strategic context suggestions (archetype / posture — optional, not enforced)
- Manual override of any field

## API architecture

| Layer | Role |
|-------|------|
| `app/api/retailer-enrichment/route.ts` | Server proxy; optional Finnhub when `FINNHUB_API_KEY` is set |
| `lib/api/retailerProfileApi.ts` | Profile fetch + mapping |
| `lib/api/newsApi.ts` | News fetch + relevance tagging |
| `lib/api/contextResolver.ts` | Merge lookup, API, curated fallback, overrides |
| `lib/retailerLookup.ts` | Name → ticker, public/private |
| `lib/strategicContextResolver.ts` | Suggestion-only strategic notes |
| `lib/enrichmentNarrative.ts` | Snippets for executive profile notes only |

## Fallback behavior

1. Manual overrides (always win)
2. Live API (Finnhub) when key configured
3. Curated reference profiles (`data/curatedCompanyProfiles.ts`) and headlines (`data/curatedNewsHeadlines.ts`)
4. Alias hints only (partial context)

If all fail, the workflow continues with client inputs only.

## Executive summary integration

`buildRetailerPricingProfile` and `buildOpeningExecutiveNarrative` accept optional `RetailerEnrichmentBundle` for **narrative phrasing only**. Hypothesis, opportunity, and storyline math are unchanged.

## Configuration

Copy `.env.example` to `.env.local` and set `FINNHUB_API_KEY` for live enrichment. Never commit `.env` files.
