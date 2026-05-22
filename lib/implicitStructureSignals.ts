/**
 * Structure signals derived from proxy inference — feeds evidence when explicit fields are sparse.
 */

import type { ProxySignal } from "@/types/data-interpretation";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";

const PROXY_TO_SIGNAL: Record<
  ProxySignal["kind"],
  { id: string; name: string; family: SupportingSignal["signalFamily"] }
> = {
  inferred_tier: {
    id: "sig-proxy-tier-ladder",
    name: "Inferred tier ladder",
    family: "Architecture",
  },
  inferred_kvi: {
    id: "sig-proxy-kvi",
    name: "Inferred KVI concentration",
    family: "KVI",
  },
  inferred_pl_nb: {
    id: "sig-proxy-pl-nb",
    name: "Inferred PL/NB separation",
    family: "Architecture",
  },
  inferred_zone: {
    id: "sig-proxy-zone",
    name: "Inferred zoning context",
    family: "Architecture",
  },
  price_cluster: {
    id: "sig-proxy-price-cluster",
    name: "Price cluster structure",
    family: "Architecture",
  },
};

export function proxySignalsToSupportingSignals(
  proxies: ProxySignal[],
): SupportingSignal[] {
  return proxies.map((p) => {
    const meta = PROXY_TO_SIGNAL[p.kind];
    const strength =
      p.confidence === "high"
        ? "strong"
        : p.confidence === "medium"
          ? "moderate"
          : "weak";
    return {
      signalId: meta.id,
      signalName: meta.name,
      signalFamily: meta.family,
      signalStrength: strength,
      explanation: `${p.label} — ${p.detail}`,
    };
  });
}
