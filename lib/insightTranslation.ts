/**
 * Consultant-style insight translation — presentation only.
 * Converts analytical / dashboard phrasing into commercial pricing advisory language.
 */

const CONSULTANT_PHRASE_MAP: [RegExp, string][] = [
  [/visible value concentration is near the low end of expected range for mass retail\.?/gi,
    "Value investment appears spread across too many items rather than concentrated in a clear set of trip-driving KVIs, potentially diluting customer price perception."],
  [/visible value concentration is near the low end[^.]*\.?/gi,
    "Value communication appears under-concentrated — the retailer may be over-funding value across non-traffic-driving items."],
  [/architecture opportunity appears thematic\.?/gi,
    "Pricing architecture appears inconsistently structured across the portfolio, suggesting systemic ladder and tier-role misalignment rather than isolated category issues."],
  [/opportunity appears thematic\.?/gi,
    "The opportunity is driven less by isolated categories and more by portfolio-wide pricing architecture."],
  [/kvi-like items represent ~?/gi,
    "Trip-driving value represents roughly "],
  [/kvi-like revenue concentration/gi,
    "Trip-driving value concentration"],
  [/inferred category revenue weight/gi,
    "reviewed category commercial weight"],
  [/revenue weight concentrated in/gi,
    "Commercial weight is concentrated in"],
  [/tier spacing compressed in/gi,
    "Price ladders appear compressed in"],
  [/premium\/mainstream median gap:\s*/gi,
    "Premium-to-mainstream spacing: "],
  [/entry\/mainstream median gap/gi,
    "Entry-to-mainstream spacing"],
  [/pl\/nb median gap/gi,
    "Private-brand versus national-brand separation"],
  [/architecture compression indicator/gi,
    "Compressed tier spacing"],
  [/compressed premium architecture/gi,
    "Compressed premium tier spacing"],
  [/weak monetization separation/gi,
    "Unclear private-brand monetization role"],
  [/narrow pl\/nb separation/gi,
    "Private-brand role appears under-differentiated from national brands"],
  [/limited trade-up clarity/gi,
    "Unclear good-better-best trade-up path"],
  [/moderate value concentration/gi,
    "Value investment moderately broad"],
  [/broad value concentration/gi,
    "Value investment appears too broadly distributed"],
  [/modest kvi breadth/gi,
    "Insufficient concentration of trip-driving value"],
  [/localized value concentration/gi,
    "Value investment concentrated in select traffic categories"],
  [/selective visible value investment/gi,
    "Selective trip-driving value investment"],
  [/thematic width/gi,
    "breadth of structural themes"],
  [/monetizable exposure/gi,
    "in-scope commercial exposure"],
  [/architecture[- ]led/gi,
    "pricing ladder and tier structure"],
  [/bounded and architecture-led/gi,
    "primarily a pricing architecture issue"],
  [/directionally coherent/gi,
    "broadly coherent at portfolio level"],
  [/below expected spacing/gi,
    "tighter than typical competitive spacing"],
  [/near the low end of expected range/gi,
    "below typical concentration for the format"],
  [/the metric indicates/gi,
    "Signals suggest"],
  [/the data suggests a value of/gi,
    "The current structure may reflect"],
  [/the architecture opportunity score/gi,
    "The structural pricing pattern"],
  [/concentration percentile/gi,
    "value concentration"],
  [/measured upload proxy/gi,
    "reviewed pricing data"],
  [/upload proxy/gi,
    "reviewed data"],
  [/directional signal/gi,
    "commercial signal"],
  [/directionally meaningful/gi,
    "commercially meaningful"],
  [/strong measured signal/gi,
    "Notable pattern"],
  [/expected range for/gi,
    "typical pattern for"],
  [/for mass retail/gi,
    "for this format"],
  [/hybrid retail/gi,
    "hybrid format"],
];

const OPENING_REWRITES: [RegExp, string][] = [
  [/^the metric\b/gi, "Signals"],
  [/^the data suggests\b/gi, "The portfolio shows evidence that"],
  [/^data suggests\b/gi, "Signals suggest"],
  [/^analysis indicates\b/gi, "The retailer appears to"],
  [/^this indicates\b/gi, "This suggests"],
];

export function translateConsultantInsight(text: string): string {
  if (!text?.trim()) return text;
  let out = text.trim();

  for (const [re, replacement] of CONSULTANT_PHRASE_MAP) {
    out = out.replace(re, replacement);
  }

  for (const [re, replacement] of OPENING_REWRITES) {
    if (re.test(out)) {
      out = out.replace(re, replacement);
      break;
    }
  }

  out = out.replace(/\s{2,}/g, " ").replace(/\s+\./g, ".").trim();
  return simplifyPlainLanguage(out);
}

/** Plain business language for non-pricing executives (runs after consultant pass). */
const PLAIN_LANGUAGE_MAP: [RegExp, string][] = [
  [/\btrip-driving value\b/gi, "the products customers compare on price"],
  [/\btrip-driving\b/gi, "high-visibility"],
  [/\bvalue concentration\b/gi, "where low prices show up"],
  [/\bvalue communication\b/gi, "how clearly the store communicates low prices"],
  [/\bvalue investment\b/gi, "investment in lower prices"],
  [/\bvalue-oriented pricing\b/gi, "lower prices across the assortment"],
  [/\bvalue spread\b/gi, "discount spread"],
  [/\bvalue anchoring\b/gi, "a clear low-price reputation"],
  [/\bvalue image\b/gi, "price reputation"],
  [/\bpricing architecture\b/gi, "how budget, mainstream, and premium options are arranged"],
  [/\bprice ladder(s)?\b/gi, "good-better-best options"],
  [/\bprice ladders\b/gi, "good-better-best options"],
  [/\btier spacing\b/gi, "price gaps between budget, mainstream, and premium"],
  [/\btier[- ]role\b/gi, "role of each price level"],
  [/\btier(s)?\b/gi, "price level"],
  [/\bspacing compression\b/gi, "smaller price gaps than shoppers expect"],
  [/\bspacing\b/gi, "price gap"],
  [/\bmonetization\b/gi, "margin"],
  [/\bmonetization gap\b/gi, "margin gap"],
  [/\bsignaling\b/gi, "communication to shoppers"],
  [/\btrade-up\b/gi, "moving customers to higher-priced options"],
  [/\bpremiumization\b/gi, "selling more premium products"],
  [/\bopening-price\b/gi, "entry-price"],
  [/\bentry-to-mainstream\b/gi, "budget to everyday"],
  [/\bpremium-to-mainstream\b/gi, "premium to everyday"],
  [/\bprivate-brand\b/gi, "store brand"],
  [/\bnational brand\b/gi, "well-known brand"],
  [/\bcommercial weight\b/gi, "sales importance"],
  [/\bcommercially material\b/gi, "financially meaningful"],
  [/\bstructural pricing pattern\b/gi, "pattern across the store"],
  [/\bthematic\b/gi, "broad"],
  [/\bportfolio-wide\b/gi, "across the store"],
  [/\bin reviewed scope\b/gi, "in the categories reviewed"],
  [/\breviewed data\b/gi, "the pricing review"],
  [/\bKVI(s)?\b/g, "items shoppers compare on price"],
  [/\barchitecture\b/gi, "product and price structure"],
  [/\bincoherent\b/gi, "unclear"],
  [/\blegible\b/gi, "clear"],
  [/\bdifferentiated\b/gi, "clearly different"],
  [/\bunder-differentiated\b/gi, "not clearly different"],
  [/\bover-funding value\b/gi, "cutting prices too broadly"],
  [/\bover-investing\b/gi, "spending too much on"],
];

export function simplifyPlainLanguage(text: string): string {
  if (!text?.trim()) return text;
  let out = text.trim();
  for (const [re, replacement] of PLAIN_LANGUAGE_MAP) {
    out = out.replace(re, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

/** Full pipeline: consultant tone + plain-language pass. */
export function translateExecutiveInsight(text: string): string {
  return simplifyPlainLanguage(translateConsultantInsight(text));
}

/** Short labels for driver chips and theme titles. */
export function consultantThemeLabel(engineLabel: string): string {
  const key = engineLabel.trim().toLowerCase();
  const map: Record<string, string> = {
    "broad value concentration": "Discounts spread too widely",
    "moderate value concentration": "Lower prices spread across many items",
    "localized value concentration": "Low prices focused in a few areas",
    "modest kvi breadth": "Weak focus on comparison items",
    "value spread too broadly": "Discounts spread too widely",
    "value communication diffuse": "Low prices not focused enough",
    "compressed premium architecture": "Premium feels like everyday",
    "limited premium separation": "Premium not clearly better",
    "limited trade-up clarity": "Hard to see budget vs premium",
    "weak monetization separation": "Store brand vs brand-name blur",
    "selective pl/nb compression": "Store brands priced too close to brands",
    "architecture compression": "Budget / mainstream / premium blur",
    "selective architecture inconsistency": "Unclear good-better-best story",
    "misaligned pricing architecture": "Customers may not see clear price steps",
  };
  return map[key] ?? translateExecutiveInsight(engineLabel);
}

/** One-line commercial diagnosis from KVI concentration evidence. */
export function consultantKviDiagnosis(evidence: {
  kviRevenueSharePct?: number;
  broadKviBreadth?: boolean;
  weakKviConcentration?: boolean;
  kviCategoryCount?: number;
}): string | null {
  const pct = evidence.kviRevenueSharePct ?? 0;
  const cats = evidence.kviCategoryCount ?? 0;

  if (pct < 10 && !evidence.broadKviBreadth && cats === 0) return null;

  if (evidence.broadKviBreadth && pct >= 20) {
    return "The retailer may be spreading discounts across too many products instead of concentrating them on comparison items. Margin may leak where low prices do not change how customers judge the store.";
  }
  if (evidence.weakKviConcentration || (pct >= 8 && pct < 14)) {
    return "Lower prices may not be focused enough on the items shoppers compare most. The business may be giving away margin in places that do not shape price reputation.";
  }
  if (cats <= 2 && pct > 0 && pct < 18) {
    return "Low prices are mainly visible in a few categories. Elsewhere, the store may not build a clear affordable-price message.";
  }
  if (pct >= 14 && pct < 22) {
    return "Lower prices matter in the mix, but the retailer could sharpen which items should visibly anchor affordability.";
  }
  return "The retailer may be investing in lower prices too broadly across the assortment instead of focusing on the products that shape how customers see the whole store.";
}

/** Commercial diagnosis for architecture / ladder issues. */
export function consultantArchitectureDiagnosis(opts: {
  compressed?: boolean;
  systemic?: boolean;
  categoryNames?: string[];
}): string {
  if (opts.systemic) {
    return "Customers may not see a clear progression between budget, mainstream, and premium options across the store. The issue appears broad rather than isolated to one aisle.";
  }
  if (opts.compressed && opts.categoryNames?.length) {
    const names = opts.categoryNames.slice(0, 2).join(" and ");
    return `In ${names}, shoppers may struggle to see why they should pay more for “better” or “premium” options. The assortment may not tell a simple budget-to-premium story.`;
  }
  if (opts.compressed) {
    return "Customers may not see a clear progression between budget, mainstream, and premium options. Smaller price gaps can make every product feel similarly priced.";
  }
  return "Budget, mainstream, and premium options are mostly distinguishable, but some categories still blur together.";
}

/** Entry-price signaling diagnosis. */
export function consultantEntryPriceDiagnosis(shallow: boolean): string {
  if (shallow) {
    return "Entry-price products may not be cheap enough to clearly communicate affordability. Shoppers looking for a deal may not get a strong “this store is low price” message.";
  }
  return "Budget items appear far enough below everyday prices that shoppers can see an affordability story.";
}

/** Premium spacing diagnosis. */
export function consultantPremiumDiagnosis(compressed: boolean): string {
  if (compressed) {
    return "Premium products may not feel meaningfully better or more differentiated than mainstream options. Shoppers may not see a reason to pay more — which can leave margin on the table.";
  }
  return "Premium options appear clearly stepped above everyday products. Customers can see why they would pay more.";
}

/** Private-brand role diagnosis. */
export function consultantPlNbDiagnosis(narrow: boolean): string {
  if (narrow) {
    return "Store-brand products may sit too close in price to well-known brands. Shoppers may not feel a meaningful difference — and the business may be giving away margin on both.";
  }
  return "Store brands and well-known brands are priced far enough apart that shoppers understand the choice.";
}

/** Format a pricing observation bullet for memo / executive surfaces. */
export function formatConsultantObservation(headline: string, detail?: string): string {
  const h = translateConsultantInsight(headline.replace(/\.$/, ""));
  if (!detail?.trim()) return h.endsWith(".") ? h : `${h}.`;
  const d = translateConsultantInsight(detail);
  if (d.toLowerCase().startsWith(h.toLowerCase().slice(0, 20))) return d;
  return `${h}: ${d.endsWith(".") ? d : `${d}.`}`;
}
