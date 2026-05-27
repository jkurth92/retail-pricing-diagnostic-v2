/**
 * Bounded interpretation of consultant feedback and slider positions.
 * Rule-based only — no generative AI, no evidence mutation.
 */

import {
  DEFAULT_REFINEMENT_SLIDERS,
  mergeRefinementEmphasis,
  NEUTRAL_REFINEMENT_EMPHASIS,
} from "@/lib/refinementState";
import type {
  RefinementConfidenceTone,
  RefinementEmphasis,
  RefinementSliderState,
  RefinementTrailEntry,
} from "@/types/refinement";

export type InterpretedRefinement = {
  emphasis: RefinementEmphasis;
  trail: RefinementTrailEntry[];
  feedbackRecognized: boolean;
};

function toneFromConfidenceSlider(value: number): RefinementConfidenceTone {
  if (value <= 35) return "cautious";
  if (value >= 65) return "assertive";
  return "neutral";
}

/** Map sliders to bounded emphasis deltas. */
export function slidersToEmphasis(
  sliders: RefinementSliderState = DEFAULT_REFINEMENT_SLIDERS,
): { emphasis: Partial<RefinementEmphasis>; trail: RefinementTrailEntry[] } {
  const trail: RefinementTrailEntry[] = [];
  const emphasis: Partial<RefinementEmphasis> = {};

  const opp = sliders.opportunityFraming;
  /** 0 → 0.76, 50 → 1.0, 100 → 1.24 (clamped later to modest bounds) */
  emphasis.opportunityWidthFactor = 0.76 + (opp / 100) * 0.48;
  if (opp <= 35) {
    trail.push({
      id: "slider-opp-conservative",
      label: "Opportunity width tightened modestly",
      source: "slider",
    });
  } else if (opp >= 65) {
    trail.push({
      id: "slider-opp-aggressive",
      label: "Opportunity width widened modestly",
      source: "slider",
    });
  }

  const arch = sliders.architectureEmphasis;
  emphasis.architectureWeight = (arch - 50) / 50;
  emphasis.premiumizationWeight = emphasis.architectureWeight * 0.35;
  if (arch >= 65) {
    trail.push({
      id: "slider-arch-up",
      label: "Architecture weighting increased",
      source: "slider",
    });
  } else if (arch <= 35) {
    trail.push({
      id: "slider-arch-down",
      label: "Architecture weighting reduced",
      source: "slider",
    });
  }

  const conf = sliders.confidenceAdjustment;
  emphasis.confidenceTone = toneFromConfidenceSlider(conf);
  if (emphasis.confidenceTone === "cautious") {
    trail.push({
      id: "slider-conf-cautious",
      label: "Narrative tone shifted toward cautious framing",
      source: "slider",
    });
  } else if (emphasis.confidenceTone === "assertive") {
    trail.push({
      id: "slider-conf-assertive",
      label: "Narrative tone shifted toward assertive framing",
      source: "slider",
    });
  }

  return { emphasis, trail };
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  beauty: ["Beauty", "Personal care"],
  household: ["Household essentials", "Household"],
  grocery: ["Grocery", "Food"],
  pet: ["Pet"],
  home: ["Home", "Home decor"],
};

function extractCategories(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const [key, labels] of Object.entries(CATEGORY_ALIASES)) {
    if (lower.includes(key)) found.push(labels[0]);
  }
  const andMatch = text.match(
    /(?:focus on|emphasize|highlight|prioritize)\s+([A-Za-z][A-Za-z\s,&]+?)(?:\s+categor|$|\.)/i,
  );
  if (andMatch) {
    andMatch[1]
      .split(/\s+and\s+|,\s*/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2)
      .forEach((s) => found.push(s.charAt(0).toUpperCase() + s.slice(1)));
  }
  return [...new Set(found)];
}

/** Rule-based natural-language feedback → bounded emphasis patches. */
export function interpretRefinementFeedback(
  feedback: string,
): { patch: Partial<RefinementEmphasis>; trail: RefinementTrailEntry[]; recognized: boolean } {
  const text = feedback.trim();
  if (!text) {
    return { patch: {}, trail: [], recognized: false };
  }

  const t = text.toLowerCase();
  const patch: Partial<RefinementEmphasis> = {};
  const trail: RefinementTrailEntry[] = [];
  let recognized = false;

  const bump = (key: keyof RefinementEmphasis, delta: number, label: string, id: string) => {
    if (typeof patch[key] === "number") {
      (patch[key] as number) += delta;
    } else {
      (patch as Record<string, number>)[key] = delta;
    }
    trail.push({ id, label, source: "feedback" });
    recognized = true;
  };

  if (
    /premiumization|premium\s+products|trade[- ]?up/i.test(t) &&
    /emphas|priorit|dominat|over/i.test(t)
  ) {
    bump("premiumizationWeight", 0.45, "Premiumization emphasis increased", "fb-premium-up");
    bump("kviWeight", -0.2, "Value-concentration themes deprioritized", "fb-kvi-down");
  }

  if (/value concentration|kvi|low[- ]price spread|visible value/i.test(t) && /emphas|priorit|more/i.test(t)) {
    bump("kviWeight", 0.4, "Value-concentration emphasis increased", "fb-kvi-up");
  }

  if (/architecture|good-better-best|tier|ladder/i.test(t) && /dominat|emphas|lead|should/i.test(t)) {
    bump("architectureWeight", 0.5, "Architecture storyline dominance increased", "fb-arch-dom");
  }

  if (/promo|promotion|markdown|discount/i.test(t) && /reduce|less|lower|de[- ]?emphas|soften/i.test(t)) {
    bump("promoWeight", -0.45, "Promo themes deprioritized", "fb-promo-down");
  }

  if (
    /too aggressive|feels aggressive|range feels high|too high|too broad|appears too broad/i.test(t)
  ) {
    patch.opportunityWidthFactor = 0.84;
    patch.confidenceTone = "cautious";
    trail.push({
      id: "fb-opp-tight",
      label: "Opportunity framing tightened modestly",
      source: "feedback",
    });
    trail.push({
      id: "fb-cautious",
      label: "Confidence language softened",
      source: "feedback",
    });
    recognized = true;
  }

  if (/tighten|narrow|conservative|more cautious/i.test(t) && /opportunit|range|margin/i.test(t)) {
    patch.opportunityWidthFactor = 0.86;
    trail.push({
      id: "fb-tighten",
      label: "Opportunity width tightened modestly",
      source: "feedback",
    });
    recognized = true;
  }

  if (/widen|aggressive|expand/i.test(t) && /opportunit|range/i.test(t)) {
    patch.opportunityWidthFactor = 1.1;
    trail.push({
      id: "fb-widen",
      label: "Opportunity width widened modestly",
      source: "feedback",
    });
    recognized = true;
  }

  if (/lower maturity|less mature|early maturity|immature/i.test(t)) {
    patch.maturityHint = "lower";
    patch.confidenceTone = "cautious";
    patch.opportunityWidthFactor = 0.88;
    trail.push({
      id: "fb-maturity",
      label: "Maturity framing adjusted toward cautious interpretation",
      source: "feedback",
    });
    recognized = true;
  }

  if (/higher maturity|more mature|advanced maturity/i.test(t)) {
    patch.maturityHint = "higher";
    trail.push({
      id: "fb-maturity-high",
      label: "Maturity framing adjusted toward assertive interpretation",
      source: "feedback",
    });
    recognized = true;
  }

  if (/private[- ]?label|store brand|pl\/nb/i.test(t) && /emphas|priorit/i.test(t)) {
    bump("plNbWeight", 0.35, "Store-brand themes emphasized", "fb-pl-up");
  }

  const categories = extractCategories(text);
  if (categories.length > 0) {
    patch.categoryBoosts = categories;
    trail.push({
      id: "fb-categories",
      label: `${categories.slice(0, 2).join(", ")} category emphasis increased`,
      source: "feedback",
    });
    recognized = true;
  }

  if (/cautious|careful|understated|soften/i.test(t) && !patch.confidenceTone) {
    patch.confidenceTone = "cautious";
    trail.push({
      id: "fb-tone-cautious",
      label: "Narrative tone shifted toward cautious framing",
      source: "feedback",
    });
    recognized = true;
  }

  if (/assertive|confident|stronger language/i.test(t)) {
    patch.confidenceTone = "assertive";
    trail.push({
      id: "fb-tone-assertive",
      label: "Narrative tone shifted toward assertive framing",
      source: "feedback",
    });
    recognized = true;
  }

  return { patch, trail, recognized };
}

/** Compile sliders + feedback into one bounded emphasis profile. */
export function compileRefinementControls(
  sliders: RefinementSliderState,
  feedback: string,
): InterpretedRefinement {
  const fromSliders = slidersToEmphasis(sliders);
  const fromFeedback = interpretRefinementFeedback(feedback);

  let emphasis = mergeRefinementEmphasis(NEUTRAL_REFINEMENT_EMPHASIS, fromSliders.emphasis);
  emphasis = mergeRefinementEmphasis(emphasis, fromFeedback.patch);

  const trail = dedupeTrail([...fromSliders.trail, ...fromFeedback.trail]);

  const slidersNeutral =
    sliders.opportunityFraming === 50 &&
    sliders.architectureEmphasis === 50 &&
    sliders.confidenceAdjustment === 50;

  return {
    emphasis,
    trail,
    feedbackRecognized: fromFeedback.recognized || !slidersNeutral || feedback.trim().length > 0,
  };
}

function dedupeTrail(trail: RefinementTrailEntry[]): RefinementTrailEntry[] {
  const seen = new Set<string>();
  return trail.filter((t) => {
    if (seen.has(t.label)) return false;
    seen.add(t.label);
    return true;
  });
}
