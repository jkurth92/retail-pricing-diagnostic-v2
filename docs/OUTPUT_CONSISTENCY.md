# Output Consistency

## Theme count

- **3–5 primary themes** after confidence filter and ranking
- Up to **2 secondary** themes
- Duplicate theme families suppressed in calibration pass when enabled

## Opportunity ranges

- Thematic **percentage bands** only — never dollar totals unless scope formulas are aligned
- Per-theme spans flagged when wider than calibration max
- Aggregated total uses **overlap factor** — interpret as one structural pool, not a sum of initiatives

## Confidence

- Low-confidence hypotheses **suppressed** before surfacing
- Primary themes require **medium** or higher confidence
- Confidence summary states coverage honestly (partial vs strong)

## Margin vs revenue

| Priority | Display |
|----------|---------|
| Primary | Margin opportunity hero / first column |
| Secondary | Revenue sensitivity prose — directional, elasticity as modifier |

## Storyline coherence

Sections follow architecture-first order in `data/executiveStorylineFlow.ts`:

1. Retailer profile  
2. Architecture coherence  
3. KVI / roles  
4. Promo / markdown  
5. Governance  
6. Opportunity framing  
7. Strategic implications  

Empty sections omitted except profile, opportunity, and implications anchors.

## API vs client data

- **Client uploads and knowledge inputs** drive hypotheses and themes
- **API enrichment** affects overview copy and executive profile notes only
- **Manual overrides** replace enriched scalar fields

## Clutter to avoid

- Duplicate storyline panels on evidence tabs
- Framework layer progress on default journey steps
- Raw API dumps in overview UI
