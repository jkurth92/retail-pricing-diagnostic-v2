# Product Direction

## Strategic shift

The product is evolving from a strict SKU-to-retailer matching tool into a **consulting-style diagnostic engine**:

```
Client context → Client uploads → Retailer overview → Scope of diagnostic → Observed pricing patterns → Opportunity size
```

Downstream (after alignment): benchmark interpretation, explainable recommendations, memo / storyline.

The primary value is structured diagnostic reasoning grounded in client evidence and aligned benchmark POV — not single-retailer SKU parity alone.

## Revised workflow (Step 2)

| Step | Purpose |
|------|---------|
| Client Context | Establish retailer facts, EPR maturity, strategic posture, and editable competitor suggestions |
| Client Uploads | Define what evidence will be available (schema alignment pending) |
| Retailer Overview | Contextualize the business, financial placeholders, and selected peer set |
| Scope of Diagnostic | Define the sizing denominator and lever/category scope |
| Observed Pricing Patterns | Surface diagnostic evidence by lever (generated later from uploads + rules) |
| Opportunity Size | Translate evidence into value only after aligned rules and formulas exist |

### Rationale

- **Client context** establishes retailer facts before evidence intake.
- **Uploads** define available evidence; without schema alignment, patterns cannot be generated.
- **Retailer overview** contextualizes the business and competitive set (peers from validated selection).
- **Scope** defines the sizing denominator — not opportunity.
- **Observed pricing patterns** create diagnostic evidence from uploads and rules.
- **Opportunity size** translates evidence into value only after explicit rule and formula alignment.

## Retained components

- Client context capture (retailer, EPR maturity, strategic posture)
- Modular workflow across pricing, promotions, and markdown (top tabs)
- Upload-driven evidence (expanded upload types in Step 2 shell)
- Opportunity framing by lever (structure only until rules exist)
- Explainability and user override paths (planned)

## De-emphasized components

- Strict SKU-to-single-retailer matching as the core workflow
- Hardcoded third-party benchmark packs or proprietary consulting IP
- Externally validated competitor suggestions without user confirmation
- Unsupported numeric outputs from AI narrative

## Future modules

| Module | Focus |
|--------|--------|
| KVI | Key value item positioning and competitive price gaps |
| Architecture | Price ladder, good-better-best, and pack-price relationships |
| Zoning | Geographic and channel price consistency |
| Promotions | Promo depth, frequency, and integration with everyday price |
| Markdown | Clearance cadence, inventory risk, and margin recovery |

Each module will connect to aligned rules and benchmarks after explicit sign-off — not before.
