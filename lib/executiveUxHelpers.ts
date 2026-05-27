/** Presentation-only helpers — no sizing or benchmark math. */

export function shortenThemeTitle(headline: string): string {
  const cleaned = headline
    .replace(/\b(may indicate|appears to|suggesting|observed)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= 48) return cleaned;
  const cut = cleaned.slice(0, 45).trim();
  return cut.endsWith(",") ? `${cut}…` : `${cut}…`;
}

export type ParsedEvidenceMetric = {
  label: string;
  value: string;
  strength?: "strong" | "moderate" | "weak";
};

export function parseEvidenceMetricLine(line: string): ParsedEvidenceMetric {
  const strengthMatch = line.match(/\((strong|moderate|weak)\)/i);
  const strength = strengthMatch
    ? (strengthMatch[1].toLowerCase() as ParsedEvidenceMetric["strength"])
    : undefined;

  const colon = line.indexOf(":");
  if (colon > 0) {
    return {
      label: line.slice(0, colon).trim(),
      value: line.slice(colon + 1).trim().replace(/\s*\(strong|moderate|weak\)/i, ""),
      strength,
    };
  }

  if (line.length > 60) {
    return { label: line.slice(0, 40).trim() + "…", value: "" };
  }
  return { label: line, value: "" };
}

export function confidenceLabelFromTrace(
  _formulaSummary?: string,
  lowPct?: number,
  highPct?: number,
): string | undefined {
  return businessRangeConfidenceLabel(lowPct, highPct);
}

/** Business-facing range width label for executive charts. */
export function businessRangeConfidenceLabel(
  lowPct?: number,
  highPct?: number,
): string | undefined {
  if (lowPct == null || highPct == null) return undefined;
  const span = highPct - lowPct;
  if (span <= 0.6) return "Relatively narrow opportunity range";
  if (span <= 1.2) return "Opportunity reflects several structural drivers";
  return "Opportunity range spans multiple structural themes";
}
