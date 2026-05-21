/** Boardroom-style currency formatting ($M / $B). */
export function formatExecutiveCurrency(
  value: number | null | undefined,
  options?: { empty?: string },
): string {
  if (value == null || !Number.isFinite(value)) {
    return options?.empty ?? "—";
  }
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs / 1_000)}K`;
  }
  return `${sign}$${abs.toFixed(0)}`;
}

/** Parse user or profile text into a number for calculations. */
export function parseCurrencyToNumber(text: string): number | null {
  const trimmed = text.trim().replace(/,/g, "").replace(/\$/g, "");
  if (!trimmed) return null;
  const match = trimmed.match(/^(-?[\d.]+)\s*([bmk])?$/i);
  if (!match) {
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  let value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  const unit = match[2]?.toLowerCase();
  if (unit === "b") value *= 1e9;
  else if (unit === "m") value *= 1e6;
  else if (unit === "k") value *= 1e3;
  return value;
}
