# Retail Pricing Diagnostic (v2)

Agentic retail pricing diagnostic application — Step 1 UI scaffold.

## Product purpose

This app supports a consulting-style pricing diagnostic workflow:

1. Client context and uploads
2. Observed pricing pattern analysis
3. Benchmark interpretation
4. Opportunity sizing
5. Explainable recommendations and memo generation

Step 1 delivers the professional UI shell and project foundation only.

## Current scope (Step 1)

- Next.js App Router with TypeScript and Tailwind CSS
- Consulting-style layout: sidebar, header summary, module tabs, workflow tabs
- Client Context screen with retailer input, EPR scoring (UI state), strategic context, upload placeholders
- Placeholder screens: Scope of Diagnostic, Retailer Overview, Opportunity Size
- UI-only types and transparent EPR average display
- Product and build guardrail documentation

## Intentionally not implemented yet

- Database and authentication
- External APIs and retailer data fetch
- File upload backend and parsing (CSV, PDF, etc.)
- Benchmark rules, pricing thresholds, and consulting IP
- Walmart or strict SKU-to-retailer matching
- Elasticity, KVI, zoning, architecture, promotion, or markdown rules
- Opportunity sizing formulas and confidence scoring
- AI-generated recommendations or unsupported numeric outputs

## Run locally

```bash
cd retail-pricing-diagnostic-v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run lint
npm run build
```

## GitHub sync

Target repository: **retail-pricing-diagnostic-v2** (private).

If GitHub CLI is installed:

```bash
gh auth login
gh repo create retail-pricing-diagnostic-v2 --private --source=. --remote=origin --push
```

Without `gh`, create the repo on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/retail-pricing-diagnostic-v2.git
git push -u origin main
```

Do not commit `.env` files or secrets.

## Documentation

- [docs/PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md)
- [docs/BUILD_GUARDRAILS.md](docs/BUILD_GUARDRAILS.md)
- [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)
