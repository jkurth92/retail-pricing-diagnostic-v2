/**
 * Proxy field and signal inference when canonical fields are missing.
 */

import { inferTierStructure } from "@/lib/tierInference";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { ProxySignal } from "@/types/data-interpretation";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

const ARCH_CORE: CanonicalFieldKey[] = ["price", "category"];
const KVI_PROXY: CanonicalFieldKey[] = ["revenue", "units", "category"];
const ZONE_PROXY: CanonicalFieldKey[] = ["store", "region"];

export type ProxyInferenceInput = {
  presentFields: CanonicalFieldKey[];
  categoryNames: string[];
  archetypeId: RetailerArchetypeId;
  retailerTicker?: string | null;
};

export type ProxyInferenceResult = {
  inferredFields: CanonicalFieldKey[];
  signals: ProxySignal[];
};

export function inferProxyFields(input: ProxyInferenceInput): ProxyInferenceResult {
  const present = new Set(input.presentFields);
  const inferred = new Set<CanonicalFieldKey>();
  const signals: ProxySignal[] = [];

  const hasPrice = present.has("price");
  const hasCategory = present.has("category");
  const hasPack = present.has("packSize");
  const hasPl = present.has("privateLabelFlag");
  const hasKvi = present.has("kviFlag");
  const hasZone = present.has("zone");

  if (!hasPrice && (present.has("revenue") || present.has("units"))) {
    inferred.add("price");
    signals.push({
      id: "proxy-price-from-sales",
      kind: "price_cluster",
      label: "Price proxy",
      detail:
        "Regular price inferred directionally from sales/unit fields and category structure.",
      confidence: "medium",
      supportsFields: ["price"],
    });
  }

  if (!hasCategory && input.categoryNames.length > 0) {
    inferred.add("category");
    signals.push({
      id: "proxy-category-scope",
      kind: "inferred_tier",
      label: "Category scope",
      detail: "Categories taken from upload scope and normalized taxonomy.",
      confidence: "high",
      supportsFields: ["category"],
    });
  }

  if (!hasKvi && KVI_PROXY.every((f) => present.has(f) || inferred.has(f))) {
    inferred.add("kviFlag");
    signals.push({
      id: "proxy-kvi-concentration",
      kind: "inferred_kvi",
      label: "KVI proxy",
      detail:
        "Likely KVIs inferred from traffic-driver categories and revenue concentration proxies.",
      confidence: "medium",
      supportsFields: ["kviFlag"],
    });
  }

  if (!hasPl && hasPrice && hasCategory) {
    inferred.add("privateLabelFlag");
    signals.push({
      id: "proxy-pl-nb",
      kind: "inferred_pl_nb",
      label: "PL/NB proxy",
      detail:
        "Private-label separation inferred from brand/label patterns in scope categories.",
      confidence: "medium",
      supportsFields: ["privateLabelFlag"],
    });
  }

  if (!hasZone && ZONE_PROXY.some((f) => present.has(f))) {
    inferred.add("zone");
    signals.push({
      id: "proxy-zone-store",
      kind: "inferred_zone",
      label: "Zoning proxy",
      detail: "Pricing zone inferred from store/region fields — directional only.",
      confidence: "low",
      supportsFields: ["zone"],
    });
  }

  if (!hasPack && hasPrice) {
    inferred.add("packSize");
    signals.push({
      id: "proxy-pack-ladder",
      kind: "price_cluster",
      label: "Pack-size proxy",
      detail: "Pack-size ladder inferred from price band clustering within categories.",
      confidence: "medium",
      supportsFields: ["packSize"],
    });
  }

  const tierBands = inferTierStructure({
    hasExplicitTier: false,
    hasPrice: hasPrice || inferred.has("price"),
    hasPackSize: hasPack || inferred.has("packSize"),
    hasPrivateLabelFlag: hasPl || inferred.has("privateLabelFlag"),
    categoryCount: input.categoryNames.length,
    archetypeId: input.archetypeId,
  });

  if (tierBands.length > 0 && (hasPrice || inferred.has("price"))) {
    signals.push({
      id: "proxy-tier-ladder",
      kind: "inferred_tier",
      label: "Tier inference",
      detail: tierBands.map((t) => `${t.tier}: ${t.inferredFrom}`).join("; "),
      confidence: tierBands[0].confidence >= 0.7 ? "medium" : "low",
      supportsFields: ["price", "category"],
    });
  }

  if (ARCH_CORE.every((f) => present.has(f) || inferred.has(f))) {
    for (const f of ARCH_CORE) {
      if (!present.has(f)) inferred.add(f);
    }
  }

  return {
    inferredFields: [...inferred],
    signals,
  };
}
