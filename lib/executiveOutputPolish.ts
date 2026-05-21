import type { EvidenceBackedThemeLine } from "@/types/evidence-computation";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { LeverPatternFeaturesSection } from "@/types/pattern-features";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { LeverKey } from "@/types/diagnostic-output";
import type { OpportunityDriver } from "@/types/opportunity-summary";

const FILLER_RE =
  /\b(monetization architecture|pricing structure|structural pricing structure|architecture compression may indicate)\b/gi;

export function polishNarrativeText(text: string): string {
  return text
    .replace(FILLER_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

export function polishEvidenceThemes(
  themes: EvidenceBackedThemeLine[],
  max = 3,
): EvidenceBackedThemeLine[] {
  return themes.slice(0, max).map((t) => ({
    headline: polishNarrativeText(t.headline),
    detail: polishNarrativeText(t.detail),
  }));
}

export function polishEvidenceMetrics(metrics: string[], max = 4): string[] {
  return metrics.slice(0, max);
}

export function metricToConciseImplication(metric: string): string | null {
  const m = metric.toLowerCase();
  if (m.includes("premium") && m.includes("gap")) {
    return "Tight tier spacing may limit premium trade-up.";
  }
  if (m.includes("pl/nb") || m.includes("private-label")) {
    return "Narrow PL/NB separation may reduce monetization flexibility.";
  }
  if (m.includes("kvi")) {
    return "Broad value concentration may dilute recoverable margin.";
  }
  if (m.includes("compressed") || m.includes("tier spacing")) {
    return "Compressed tier spacing may cap trade-up in key categories.";
  }
  if (m.includes("entry") && m.includes("gap")) {
    return "Shallow entry-to-mainstream gaps may anchor value too aggressively.";
  }
  return null;
}

export function buildConciseExecutiveImplications(
  evidence: ComputedEvidenceBundle,
  fallbackOneLiner: string,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const summary of evidence.summaries) {
    const line = metricToConciseImplication(summary);
    if (line && !seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
    if (out.length >= 3) return out;
  }

  for (const theme of evidence.evidenceBackedThemes) {
    const line = metricToConciseImplication(theme.headline) ?? metricToConciseImplication(theme.detail);
    if (line && !seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
    if (out.length >= 3) return out;
  }

  const one = polishNarrativeText(fallbackOneLiner);
  if (one && !seen.has(one)) out.push(one);

  return out.slice(0, 3);
}

export function parseMarginRangeDisplay(range: string): {
  low: string;
  high: string;
  display: string;
} | null {
  const match = range.match(/(\d+(?:\.\d+)?)\s*%?\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  const low = parseFloat(match[1]);
  const high = parseFloat(match[2]);
  return {
    low: low.toFixed(1),
    high: high.toFixed(1),
    display: `${low.toFixed(1)}–${high.toFixed(1)}%`,
  };
}

export function filterOpportunityDrivers(
  drivers: OpportunityDriver[],
): OpportunityDriver[] {
  return drivers.filter((d) => {
    const r = d.marginRange.toLowerCase();
    if (r.includes("pending") || r.includes("not calculated") || r === "—") {
      return false;
    }
    if (/\+0\s*bps|0\s*bps|0\.0\s*%/.test(r)) return false;
    return true;
  });
}

export function hasInsufficientOpportunity(
  range: string,
  drivers: OpportunityDriver[],
): boolean {
  if (!range || range === "—") return true;
  if (/pending|not calculated|insufficient/i.test(range)) return true;
  return filterOpportunityDrivers(drivers).length === 0 && !parseMarginRangeDisplay(range);
}

export function shouldShowPatternLever(
  leverKey: LeverKey,
  present: Set<CanonicalFieldKey>,
  promoMarkdownEligible: boolean,
): boolean {
  if (leverKey === "promotions") return promoMarkdownEligible;
  if (leverKey === "markdown") {
    return present.has("markdownFlag") || present.has("markdownPrice");
  }
  if (leverKey === "price_zoning") {
    return (present.has("store") || present.has("zone")) && present.has("price");
  }
  if (leverKey === "kvis" || leverKey === "price_architecture") {
    return present.has("price") && present.has("category");
  }
  return false;
}

export function filterPatternSectionsForConsultant(
  sections: LeverPatternFeaturesSection[],
  present: Set<CanonicalFieldKey>,
  promoMarkdownEligible: boolean,
): LeverPatternFeaturesSection[] {
  return sections.filter((section) => {
    if (!shouldShowPatternLever(section.leverKey, present, promoMarkdownEligible)) {
      return false;
    }
    const hasDefined = section.features.some(
      (f) => f.status === "defined" || f.status === "ready_for_engine",
    );
    return (
      hasDefined ||
      section.leverKey === "price_architecture" ||
      section.leverKey === "kvis"
    );
  });
}

export function isPlaceholderStatusLabel(label: string): boolean {
  const l = label.toLowerCase();
  return (
    l.includes("pending") ||
    l.includes("not calculated") ||
    l.includes("missing input") ||
    l.includes("not defined")
  );
}
