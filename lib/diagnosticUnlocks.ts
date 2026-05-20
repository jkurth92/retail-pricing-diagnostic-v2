import type { LeverKey } from "@/types/diagnostic-output";
import type {
  DiagnosticUnlockStatus,
  LeverDiagnosticUnlock,
} from "@/types/ingestion";
import type { CanonicalFieldKey } from "@/types/upload-schema";

type LeverRule = {
  leverKey: LeverKey;
  label: string;
  /** All must be present for "available" */
  requiredAll: CanonicalFieldKey[];
  /** At least one group must be fully satisfied */
  requiredOneOf?: CanonicalFieldKey[][];
  /** Present but incomplete */
  recommended: CanonicalFieldKey[];
};

const LEVER_RULES: LeverRule[] = [
  {
    leverKey: "kvis",
    label: "KVI patterns",
    requiredAll: ["price", "category"],
    requiredOneOf: [["revenue"], ["units"]],
    recommended: ["brand", "kviFlag", "unitPrice"],
  },
  {
    leverKey: "price_architecture",
    label: "Price architecture patterns",
    requiredAll: ["price", "packSize", "category"],
    recommended: ["productName", "subcategory", "privateLabelFlag"],
  },
  {
    leverKey: "price_zoning",
    label: "Price zoning patterns",
    requiredAll: ["price"],
    requiredOneOf: [["zone"], ["store"]],
    recommended: ["region", "effectiveDate"],
  },
  {
    leverKey: "promotions",
    label: "Promotion patterns",
    requiredAll: [],
    requiredOneOf: [["promoFlag"], ["promoPrice"]],
    recommended: ["price", "effectiveDate", "endDate"],
  },
  {
    leverKey: "markdown",
    label: "Markdown patterns",
    requiredAll: [],
    requiredOneOf: [["markdownFlag"], ["markdownPrice"]],
    recommended: ["cost", "margin"],
  },
];

function hasField(present: Set<CanonicalFieldKey>, field: CanonicalFieldKey) {
  return present.has(field);
}

function evaluateRule(
  rule: LeverRule,
  present: Set<CanonicalFieldKey>,
): { status: DiagnosticUnlockStatus; missing: string[] } {
  const missing: string[] = [];

  for (const f of rule.requiredAll) {
    if (!hasField(present, f)) missing.push(f);
  }

  if (rule.requiredOneOf && rule.requiredOneOf.length > 0) {
    const anyGroup = rule.requiredOneOf.some((group) =>
      group.every((f) => hasField(present, f)),
    );
    if (!anyGroup) {
      missing.push(
        `one of: ${rule.requiredOneOf.map((g) => g.join(" + ")).join(" | ")}`,
      );
    }
  }

  if (missing.length > 0) {
    const partial =
      rule.requiredAll.some((f) => hasField(present, f)) ||
      (rule.requiredOneOf?.some((g) =>
        g.some((f) => hasField(present, f)),
      ) ??
        false);
    return {
      status: partial ? "limited" : "unavailable",
      missing,
    };
  }

  const missingRecommended = rule.recommended.filter((f) => !hasField(present, f));
  if (missingRecommended.length > 0) {
    return { status: "available", missing: missingRecommended };
  }

  return { status: "ready", missing: [] };
}

export function evaluateDiagnosticUnlocks(
  normalizedFields: CanonicalFieldKey[],
): LeverDiagnosticUnlock[] {
  const present = new Set(normalizedFields);

  return LEVER_RULES.map((rule) => {
    const { status, missing } = evaluateRule(rule, present);
    let message: string;
    if (status === "unavailable") {
      message = `${rule.label} unavailable — missing ${missing.join(", ")}.`;
    } else if (status === "limited") {
      message = `${rule.label} limited — missing ${missing.join(", ")}.`;
    } else if (status === "available") {
      message = `${rule.label} available after diagnostic rule alignment.`;
    } else {
      message = `${rule.label} ready for rule alignment (no findings generated).`;
    }
    return {
      leverKey: rule.leverKey,
      label: rule.label,
      status,
      message,
      missingFields: missing,
    };
  });
}

export function groupUnlocksByStatus(unlocks: LeverDiagnosticUnlock[]) {
  return {
    unavailable: unlocks.filter((u) => u.status === "unavailable"),
    limited: unlocks.filter((u) => u.status === "limited"),
    available: unlocks.filter((u) => u.status === "available"),
    ready: unlocks.filter((u) => u.status === "ready"),
  };
}
