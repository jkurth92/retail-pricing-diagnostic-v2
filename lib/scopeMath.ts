export function calculateAddressableRevenue(
  totalRevenue: number | null,
  addressablePercent: number | null,
): number | null {
  if (
    totalRevenue === null ||
    addressablePercent === null ||
    Number.isNaN(totalRevenue) ||
    Number.isNaN(addressablePercent)
  ) {
    return null;
  }
  return totalRevenue * (addressablePercent / 100);
}

export function parseNumericInput(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, "");
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
