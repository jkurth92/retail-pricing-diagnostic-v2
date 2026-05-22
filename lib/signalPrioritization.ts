/**
 * Signal prioritization & narrative dominance (presentation / ranking only).
 * Does not alter opportunity sizing math, benchmarks, or data interpretation.
 */

import type { ComputedEvidenceBundle, EvidenceMetric } from "@/types/evidence-computation";
import type { DiagnosticHypothesis } from "@/types/diagnostic-hypotheses";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { ExecutiveTheme, ExecutiveThemeFamily } from "@/types/executive-theme";
import type { HypothesisRegistryEntry } from "@/data/diagnosticHypotheses";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RoleInferenceResult } from "@/types/role-inference";

/** 1 = highest narrative priority (architecture lens). */
export function familyDominanceTier(family: ExecutiveThemeFamily | string): number {
  if (family === "Architecture" || family === "Premiumization") return 1;
  if (family === "KVI" || family === "ValueCommunication") return 2;
  if (family === "Promotions" || family === "Markdown") return 4;
  if (family === "Governance" || family === "RoleAlignment") return 5;
  const text = String(family).toLowerCase();
  if (/pl|monetization|private/i.test(text)) return 3;
  return 3;
}

export function dominanceScoreBoost(family: ExecutiveThemeFamily): number {
  const tier = familyDominanceTier(family);
  if (tier === 1) return 45;
  if (tier === 2) return 30;
  if (tier === 3) return 18;
  if (tier === 4) return 6;
  return -20;
}

export function compareThemesByDominance(
  a: ExecutiveTheme,
  b: ExecutiveTheme,
): number {
  const tierDiff = familyDominanceTier(a.themeFamily) - familyDominanceTier(b.themeFamily);
  if (tierDiff !== 0) return tierDiff;
  const conf =
    { low: 0, medium: 1, medium_high: 2, high: 3 }[b.confidence.level] -
    { low: 0, medium: 1, medium_high: 2, high: 3 }[a.confidence.level];
  if (conf !== 0) return conf;
  return b.supportingSignals.length - a.supportingSignals.length;
}

export function orderThemesByNarrativeDominance(
  themes: ExecutiveTheme[],
): ExecutiveTheme[] {
  return [...themes].sort(compareThemesByDominance);
}

const GENERIC_FALLBACK_RE =
  /\b(limited strategic consistency|weak strategic consistency|evidence readiness may lack|lack coherent prioritization|validate with client-owned data before commercial)\b/i;

export function isGenericFallbackPhrase(text: string): boolean {
  return GENERIC_FALLBACK_RE.test(text);
}

export function filterGenericNarrativeLines(lines: string[]): string[] {
  return lines.filter((l) => l.trim().length > 0 && !isGenericFallbackPhrase(l));
}

export function classifyTextFamilyRank(text: string): number {
  const t = text.toLowerCase();
  if (
    /architecture|premium|tier|spacing|trade-up|compression|pl\/nb|monetization separation|private-label|pack-size ladder/i.test(
      t,
    )
  ) {
    if (/kvi|value concentration|visible value/i.test(t) && !/tier|premium|pl\/nb/i.test(t)) {
      return 2;
    }
    if (/pl\/nb|private-label|monetization separation/i.test(t) && !/tier|compressed premium/i.test(t)) {
      return 3;
    }
    return 1;
  }
  if (/kvi|value concentration|visible value|trip driver/i.test(t)) return 2;
  if (/pl\/nb|private-label|monetization separation/i.test(t)) return 3;
  if (/promo|promotion|markdown|discount/i.test(t)) return 4;
  if (/governance|strategic consistency|sophistication|execution leakage/i.test(t)) return 5;
  return 3;
}

export function sortLinesByFamilyPriority(lines: string[]): string[] {
  return [...lines].sort(
    (a, b) => classifyTextFamilyRank(a) - classifyTextFamilyRank(b),
  );
}

export function sortMetricsByFamilyPriority(
  metrics: EvidenceMetric[],
): EvidenceMetric[] {
  const rank = (m: EvidenceMetric): number => {
    if (m.family === "architecture") {
      if (m.id.includes("pl_nb")) return 3;
      return 1;
    }
    if (m.family === "kvi") return 2;
    return 3;
  };
  return [...metrics].sort((a, b) => rank(a) - rank(b));
}

export function architectureSignalStrength(
  evidence: ComputedEvidenceBundle,
): number {
  let score = 0;
  for (const m of evidence.metrics) {
    if (m.family === "architecture") {
      score += m.strength === "strong" ? 3 : m.strength === "moderate" ? 2 : 1;
    }
  }
  score += evidence.computedSignals.filter(
    (s) =>
      s.signalFamily === "Architecture" &&
      (s.signalStrength === "strong" || s.signalStrength === "moderate"),
  ).length;
  if (evidence.eligibleHypothesisIds.some((id) => id.startsWith("hyp-arch"))) {
    score += 2;
  }
  return score;
}

export function promoSignalStrength(
  evidence: ComputedEvidenceBundle,
  fired: SupportingSignal[],
): number {
  if (!evidence.promoMarkdownEligible) return 0;
  return fired
    .filter((s) => s.signalFamily === "Promotions" || /promo/i.test(s.signalId))
    .reduce(
      (sum, s) =>
        sum +
        (s.signalStrength === "strong" ? 3 : s.signalStrength === "moderate" ? 2 : 1),
      0,
    );
}

export function promoMateriallyStrongerThanArchitecture(
  evidence: ComputedEvidenceBundle,
  fired: SupportingSignal[],
): boolean {
  if (!evidence.promoMarkdownEligible) return false;
  const arch = architectureSignalStrength(evidence);
  const promo = promoSignalStrength(evidence, fired);
  const promoStrong = fired.some(
    (s) =>
      /promo|discount|base-price/i.test(s.signalId) && s.signalStrength === "strong",
  );
  return promoStrong && promo >= arch + 3;
}

const PROMO_HYPOTHESIS_IDS = new Set([
  "hyp-promo-dependency",
  "hyp-weak-base-price",
  "hyp-broad-discounting",
  "hyp-markdown-cadence",
  "hyp-weak-lifecycle",
  "hyp-weak-exit",
]);

const GOVERNANCE_HYPOTHESIS_IDS = new Set([
  "hyp-governance-consistency",
  "hyp-sophistication-limited",
  "hyp-execution-leakage",
  "hyp-role-alignment",
]);

export function shouldConsiderPromoHypothesis(
  hypothesisId: string,
  evidence: ComputedEvidenceBundle,
  fired: SupportingSignal[],
  supportingCount: number,
): boolean {
  if (!PROMO_HYPOTHESIS_IDS.has(hypothesisId)) return true;
  if (!evidence.promoMarkdownEligible) return false;
  if (supportingCount < 2) return false;
  if (promoMateriallyStrongerThanArchitecture(evidence, fired)) return true;
  const arch = architectureSignalStrength(evidence);
  if (arch >= 4) return false;
  return supportingCount >= 3;
}

export function shouldConsiderGovernanceHypothesis(
  entry: HypothesisRegistryEntry,
  fired: SupportingSignal[],
  knowledge: KnowledgeRegistryContext,
  roleInference: RoleInferenceResult,
  architectureEvidenceScore: number,
): boolean {
  if (!GOVERNANCE_HYPOTHESIS_IDS.has(entry.id)) return true;

  const supporting = fired.filter((s) =>
    entry.triggerSignalIds.includes(s.signalId),
  );
  if (supporting.length < 2) return false;

  const hasRoleMismatch = supporting.some((s) => s.signalId === "sig-role-mismatch");
  const hasGovernanceWeak = supporting.some((s) => s.signalId === "sig-governance-weak");
  const postureCoherent =
    knowledge.pricingPosture === "EDLP" ||
    knowledge.pricingPosture === "HiLo" ||
    knowledge.pricingPosture === "Hybrid";

  if (!hasGovernanceWeak && !hasRoleMismatch) return false;
  if (architectureEvidenceScore >= 5 && !hasRoleMismatch) return false;
  if (!postureCoherent && !hasRoleMismatch) return false;
  if (
    roleInference.categorySuggestion.confidence === "high" &&
    !hasRoleMismatch &&
    architectureEvidenceScore >= 3
  ) {
    return false;
  }

  return hasRoleMismatch || (hasGovernanceWeak && supporting.length >= 3);
}

export function hypothesisSortScore(
  entry: HypothesisRegistryEntry,
  hypothesis: DiagnosticHypothesis,
  baseScore: number,
): number {
  let score = baseScore + dominanceScoreBoost(entry.hypothesisFamily);
  if (entry.hypothesisFamily === "KVI") score += 8;
  if (entry.id === "hyp-weak-pl-nb") score += 6;
  if (entry.hypothesisFamily === "Governance") score -= 25;
  if (PROMO_HYPOTHESIS_IDS.has(entry.id)) score -= 12;
  return score;
}

export function governanceEligibleForEnabler(
  themes: ExecutiveTheme[],
): boolean {
  const gov = themes.find((t) => t.themeFamily === "Governance");
  if (!gov) return false;
  return (
    gov.confidence.level === "medium_high" ||
    gov.confidence.level === "high"
  );
}

export function localizedDriverPrefix(
  categories: string[],
  issue: "architecture" | "kvi" | "pl_nb",
): string | null {
  if (categories.length === 0) return null;
  const names = categories.slice(0, 2).join(" and ");
  if (issue === "architecture") {
    return categories.length === 1
      ? `Architecture compression is most visible in ${names}`
      : `Architecture compression is most visible in ${names}`;
  }
  if (issue === "pl_nb") {
    return `Monetization separation weakness is localized to ${names}`;
  }
  return `KVI concentration is pronounced in ${names}`;
}
