import { SIGNAL_BY_ID } from "@/data/signalDefinitions";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { RoleInferenceResult } from "@/types/role-inference";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type SignalEvaluationContext = {
  knowledge: KnowledgeRegistryContext;
  roleInference: RoleInferenceResult;
  normalizedFields: CanonicalFieldKey[];
  patternFeaturesDefined: number;
  patternFeaturesTotal: number;
  eprAverage: number | null;
};

function toSignal(
  signalId: string,
  strengthOverride?: SupportingSignal["signalStrength"],
): SupportingSignal | null {
  const def = SIGNAL_BY_ID.get(signalId);
  if (!def) return null;
  return {
    signalId: def.signalId,
    signalName: def.signalName,
    signalFamily: def.signalFamily,
    signalStrength: strengthOverride ?? def.defaultStrength,
    explanation: def.explanation,
  };
}

function hasFields(
  present: Set<CanonicalFieldKey>,
  required: CanonicalFieldKey[],
): boolean {
  return required.every((f) => present.has(f));
}

function hasAny(
  present: Set<CanonicalFieldKey>,
  options: CanonicalFieldKey[],
): boolean {
  return options.some((f) => present.has(f));
}

export function evaluateStructuralSignals(
  ctx: SignalEvaluationContext,
): SupportingSignal[] {
  const fired: SupportingSignal[] = [];
  const add = (id: string, strength?: SupportingSignal["signalStrength"]) => {
    const s = toSignal(id, strength);
    if (s) fired.push(s);
  };

  const { knowledge, roleInference } = ctx;
  const present = new Set(ctx.normalizedFields);
  const objectives = new Set(knowledge.strategicObjectives);
  const archId = knowledge.archetypeId;
  const posture = knowledge.pricingPosture;
  const infConf = roleInference.categorySuggestion.confidence;

  if (infConf === "high") add("sig-inference-strong", "strong");
  if (infConf === "low") add("sig-inference-weak", "weak");

  if (!hasFields(present, ["price", "packSize", "category"])) {
    add("sig-architecture-partial", "moderate");
  }

  const valueLed =
    objectives.has("value_perception") ||
    objectives.has("traffic_growth") ||
    posture === "EDLP" ||
    posture === "Value";
  const marginLed = objectives.has("margin_expansion");
  const premiumLed = objectives.has("premiumization");

  if (
    valueLed &&
    (archId === "mass" || archId === "discount" || archId === "grocery")
  ) {
    add("sig-ladder-compression", "moderate");
    add("sig-value-overinvest", "moderate");
    if (archId === "mass" || archId === "discount") {
      add("sig-weak-opp", "moderate");
    }
  }

  if (premiumLed || archId === "premium_grocery") {
    add("sig-weak-premium-gap", "moderate");
    add("sig-premiumization-gap", "moderate");
  } else if (valueLed) {
    add("sig-weak-premium-gap", "weak");
  }

  if (valueLed && marginLed) add("sig-kvi-misaligned", "moderate");
  if (valueLed) add("sig-kvi-breadth-high", "moderate");

  if (
    roleInference.categorySuggestion.roleId === "traffic_driver" &&
    infConf !== "low"
  ) {
    add("sig-kvi-concentration-weak", "weak");
  }

  if (archId === "premium_grocery" || archId === "specialty") {
    if (roleInference.categorySuggestion.roleId !== "destination") {
      add("sig-weak-destination", "weak");
    }
  }

  if (hasAny(present, ["promoFlag", "promoPrice"])) {
    add("sig-promo-dependency", "moderate");
    add("sig-weak-base-price", "moderate");
    if (posture === "HiLo" || posture === "Hybrid") {
      add("sig-broad-discounting", "moderate");
    }
  }

  if (!hasAny(present, ["markdownFlag", "markdownPrice"])) {
    add("sig-weak-exit", "weak");
  } else if (archId === "apparel_softlines" || archId === "mass") {
    add("sig-markdown-cadence", "moderate");
    add("sig-weak-lifecycle", "moderate");
  }

  add("sig-weak-trade-up", "moderate");
  add("sig-weak-pl-nb", "weak");

  if (!hasFields(present, ["packSize", "unitPrice"])) {
    add("sig-incoherent-ladder", "moderate");
  }

  if (ctx.eprAverage !== null && ctx.eprAverage < 3) {
    add("sig-sophistication-limited", "weak");
  }

  const coverage =
    ctx.patternFeaturesTotal > 0
      ? ctx.patternFeaturesDefined / ctx.patternFeaturesTotal
      : 0;
  if (coverage < 0.5) add("sig-execution-leakage", "weak");

  const expectedTraffic =
    archId === "mass" || archId === "discount" || archId === "grocery";
  if (
    expectedTraffic &&
    roleInference.categorySuggestion.roleId === "profit_driver"
  ) {
    add("sig-role-mismatch", "moderate");
  }

  if (
    roleInference.categorySuggestion.roleId === "profit_driver" &&
    expectedTraffic &&
    knowledge.strategicObjectives.length >= 2
  ) {
    add("sig-governance-weak", "weak");
  }

  return fired;
}

export function groupSignalsByFamily(
  signals: SupportingSignal[],
): Map<string, SupportingSignal[]> {
  const map = new Map<string, SupportingSignal[]>();
  for (const s of signals) {
    const key = s.signalFamily;
    const list = map.get(key) ?? [];
    list.push(s);
    map.set(key, list);
  }
  return map;
}

export function signalStrengthScore(strength: SupportingSignal["signalStrength"]): number {
  if (strength === "strong") return 3;
  if (strength === "moderate") return 2;
  return 1;
}
