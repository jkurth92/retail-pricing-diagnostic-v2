# Next Steps

Complete these alignment items before implementing diagnostic rules, benchmarks, or opportunity sizing.

## 1. Align v2 output contract

Define the structured JSON (or equivalent) contract for diagnostic outputs: observed patterns, benchmark interpretation, lever-level findings, confidence, and narrative fields.

## 2. Align canonical upload schema

Specify required columns and formats for:

- Price file
- Product master
- Store / zone file
- Optional context documents

Include validation rules and error handling expectations.

## 3. Align first diagnostic rules

Prioritize which rules ship first (e.g. KVI gap detection vs. architecture ladder checks). Document inputs, thresholds, and POV references per rule.

## 4. Align opportunity sizing formulas

Define lever-level and total opportunity methodology (bps, dollars, ranges), revenue basis, and explicit assumptions. No formulas in code until signed off.

## 5. Align confidence scoring approach

Specify how match coverage, data quality, and rule strength combine into confidence levels — separate from opportunity magnitude.

## Recommended sequence

1. Upload schema
2. Output contract
3. First rule pack
4. Opportunity formulas
5. Confidence model
6. External integrations (retailer overview)
7. Memo / storyline generation
