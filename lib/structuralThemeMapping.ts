/**
 * Maps observed structural patterns to opportunity themes (Step 14B).
 * Evidence-backed, benchmark-informed — not optimization outputs.
 */

import type { BenchmarkInterpretation } from "@/types/benchmark-calibration";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import {
  calibrateValueConcentrationPhrase,
  kviEvidenceFromResult,
} from "@/lib/narrativeRefinement";
import type { KviSignalResult } from "@/lib/kviSignals";

export type StructuralThemeMapping = {
  themeId: string;
  themeLabel: string;
  evidenceHooks: string[];
  benchmarkHook?: string;
};

export function mapStructuralThemes(
  arch: ArchitectureSignalResult,
  kvi: KviSignalResult,
  interpretations: BenchmarkInterpretation[],
): StructuralThemeMapping[] {
  const mappings: StructuralThemeMapping[] = [];
  const premiumInterp = interpretations.find(
    (i) => i.metricKind === "premium_mainstream_gap",
  );
  const plInterp = interpretations.find((i) => i.metricKind === "pl_nb_gap");
  const kviInterp = interpretations.find((i) => i.metricKind === "kvi_revenue_share");

  if (
    arch.compressionCategories.length > 0 ||
    premiumInterp?.position === "below_expected" ||
    premiumInterp?.position === "narrower_than_typical"
  ) {
    mappings.push({
      themeId: "architecture_compression",
      themeLabel: "Compressed premium architecture",
      evidenceHooks: [
        ...(arch.compressionCategories.length > 0
          ? [`Compressed tier spacing in ${arch.compressionCategories.slice(0, 2).join(", ")}`]
          : []),
        ...(arch.premiumMainstreamGapPct !== null
          ? [`Premium/Mainstream gap ~${Math.round(arch.premiumMainstreamGapPct)}%`]
          : []),
      ],
      benchmarkHook: premiumInterp?.narrativePhrase,
    });
  }

  if (arch.plNbCategoriesNarrow >= 1 || plInterp?.position === "below_expected") {
    const narrow = arch.plNbNarrowCategories.slice(0, 2).join(" and ");
    const isolated = arch.plNbNarrowCategories.length < 3;
    mappings.push({
      themeId: "weak_pl_nb_separation",
      themeLabel: isolated ? "Selective PL/NB compression" : "Weak monetization separation",
      evidenceHooks: narrow
        ? [
            isolated
              ? `Narrow PL/NB separation in ${narrow}`
              : `PL/NB gap below expected range in ${arch.plNbCategoriesNarrow} categories (${narrow})`,
          ]
        : [
            `PL/NB gap below expected range in ${arch.plNbCategoriesNarrow} categor${arch.plNbCategoriesNarrow === 1 ? "y" : "ies"}`,
          ],
      benchmarkHook: plInterp?.narrativePhrase,
    });
  }

  if (
    kvi.broadKviBreadth ||
    kviInterp?.position === "above_expected" ||
    kviInterp?.position === "broader_than_expected"
  ) {
    mappings.push({
      themeId: "kvi_over_investment",
      themeLabel:
        calibrateValueConcentrationPhrase(kviEvidenceFromResult(kvi)) ??
        "Moderate value concentration",
      evidenceHooks: [`KVI-like revenue weight ~${kvi.kviRevenueSharePct}%`],
      benchmarkHook: kviInterp?.narrativePhrase,
    });
  }

  if (arch.avgTierSpacingPct !== null && arch.avgTierSpacingPct < 11) {
    mappings.push({
      themeId: "flat_ladders",
      themeLabel: "Moderately flat monetization ladders",
      evidenceHooks: [`Average tier spacing ~${Math.round(arch.avgTierSpacingPct)}%`],
    });
  }

  if (arch.compressionCategories.length >= 2) {
    mappings.push({
      themeId: "architecture_incoherence",
      themeLabel: "Selective architecture inconsistency",
      evidenceHooks: ["Inconsistent tier spacing across multiple categories"],
    });
  }

  return mappings.slice(0, 5);
}
