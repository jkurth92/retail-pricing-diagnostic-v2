# Proxy signal generation (Step 15)

## Purpose

Infer missing structural concepts when canonical fields are absent.

## Modules

| Module | Role |
|--------|------|
| `lib/proxyInference.ts` | Infers price, category, KVI, PL/NB, zone, pack-size proxies |
| `lib/tierInference.ts` | Entry / mainstream / premium bands from clusters |
| `lib/implicitStructureSignals.ts` | Converts proxies to supporting signals for hypotheses |

## Examples

| Missing field | Proxy behavior |
|---------------|----------------|
| Tier | Price clustering + pack-size relationships |
| KVI flag | Traffic categories + revenue concentration |
| PL/NB flag | Brand structure in scope categories |
| Zone | Store/region fields |

Signals are labeled as inferred in consultant detail — not presented as measured facts.
