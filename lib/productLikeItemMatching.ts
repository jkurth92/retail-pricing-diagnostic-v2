/**
 * Matches uploaded product titles to comparable "like item" pairs
 * (same form factor / product type), not arbitrary category min/max price.
 */

const STOP_TOKENS = new Set([
  "with",
  "and",
  "the",
  "for",
  "from",
  "size",
  "count",
  "pack",
  "ounce",
  "fluid",
  "daily",
  "extra",
  "free",
  "new",
  "plus",
  "fresh",
  "care",
  "health",
]);

/** Ordered rules — first match wins. */
const PRODUCT_FORM_RULES: { form: string; pattern: RegExp }[] = [
  { form: "toothpaste", pattern: /\b(toothpaste|dentifrice)\b/i },
  { form: "mouthwash", pattern: /\b(mouthwash|oral rinse)\b/i },
  { form: "floss", pattern: /\b(dental floss|floss)\b/i },
  { form: "foundation", pattern: /\b(foundation|complexion filter|liquid filter|bb cream)\b/i },
  { form: "mascara", pattern: /\bmascara\b/i },
  { form: "lip_color", pattern: /\b(lipstick|lip gloss|lip color)\b/i },
  { form: "concealer", pattern: /\bconcealer\b/i },
  { form: "parfum", pattern: /\b(eau de parfum|eau de toilette|parfum)\b/i },
  { form: "body_mist", pattern: /\b(body mist|fragrance mist)\b/i },
  { form: "cologne", pattern: /\bcologne\b/i },
  { form: "vitamin", pattern: /\b(multivitamin|daily vitamin|vitamin\s+[a-d]\b|vitamins?\b)/i },
  { form: "probiotic", pattern: /\bprobiotic\b/i },
  { form: "supplement_capsule", pattern: /\b(capsule|tablet|caplet)s?\b/i },
  { form: "shampoo", pattern: /\bshampoo\b/i },
  { form: "conditioner", pattern: /\bconditioner\b/i },
  { form: "lotion", pattern: /\b(lotion|moisturiz)\b/i },
  { form: "deodorant", pattern: /\bdeodorant\b/i },
  { form: "sunscreen", pattern: /\b(sunscreen|spf)\b/i },
  { form: "petroleum_jelly", pattern: /\b(petroleum jelly|vaseline)\b/i },
  { form: "pain_relief", pattern: /\b(ibuprofen|acetaminophen|pain relief)\b/i },
  { form: "yeast_support", pattern: /\b(yeast|azo)\b/i },
];

export function productFormKey(productName: string): string | null {
  for (const rule of PRODUCT_FORM_RULES) {
    if (rule.pattern.test(productName)) return rule.form;
  }
  return null;
}

function productTokens(name: string): Set<string> {
  const tokens = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOP_TOKENS.has(t));
  return new Set(tokens);
}

export function tokenOverlapScore(a: string, b: string): number {
  const ta = productTokens(a);
  const tb = productTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) {
    if (tb.has(t)) overlap += 1;
  }
  return overlap / Math.max(ta.size, tb.size);
}

const INCOMPATIBLE_FORMS: [string, string][] = [
  ["foundation", "parfum"],
  ["foundation", "body_mist"],
  ["foundation", "cologne"],
  ["vitamin", "probiotic"],
  ["vitamin", "yeast_support"],
  ["toothpaste", "mouthwash"],
  ["parfum", "body_mist"],
  ["shampoo", "conditioner"],
];

function formsCompatible(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  for (const [x, y] of INCOMPATIBLE_FORMS) {
    if ((a === x && b === y) || (a === y && b === x)) return false;
  }
  return false;
}

/** True when two product titles are reasonable shelf comparables (same form or strong token overlap). */
export function areLikeItems(productA: string, productB: string): boolean {
  if (productA.trim().toLowerCase() === productB.trim().toLowerCase()) return false;

  const formA = productFormKey(productA);
  const formB = productFormKey(productB);
  if (formA && formB) return formsCompatible(formA, formB) && formA === formB;

  if (formA || formB) {
    const withForm = formA ? productA : productB;
    const other = formA ? productB : productA;
    const otherForm = productFormKey(other);
    if (otherForm) return formsCompatible(formA ?? formB, otherForm) && (formA ?? formB) === otherForm;
    return tokenOverlapScore(withForm, other) >= 0.38;
  }

  return tokenOverlapScore(productA, productB) >= 0.42;
}

export type LikeItemPricePair = {
  higher: { name: string; price: number };
  lower: { name: string; price: number };
  formKey: string | null;
  spreadPct: number;
};

export function findBestLikeItemPricePair(
  items: { name: string; price: number }[],
  minSpreadPct = 5,
): LikeItemPricePair | null {
  let best: LikeItemPricePair | null = null;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (!areLikeItems(a.name, b.name)) continue;

      const higher = a.price >= b.price ? a : b;
      const lower = a.price >= b.price ? b : a;
      if (higher.price <= 0) continue;
      const spreadPct = ((higher.price - lower.price) / higher.price) * 100;
      if (spreadPct < minSpreadPct) continue;

      if (!best || spreadPct > best.spreadPct) {
        best = {
          higher: { name: higher.name, price: higher.price },
          lower: { name: lower.name, price: lower.price },
          formKey: productFormKey(higher.name) ?? productFormKey(lower.name),
          spreadPct,
        };
      }
    }
  }

  return best;
}
