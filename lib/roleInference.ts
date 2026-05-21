import { ROLE_INFERENCE_RULES } from "@/data/roleInferenceRules";
import { CATEGORY_ROLE_BY_ID } from "@/data/categoryRoles";
import { RETAILER_ARCHETYPE_BY_ID } from "@/data/retailerArchetypes";
import {
  buildCategoryRationale,
  buildItemMixRationale,
  resolveRationaleTemplate,
} from "@/lib/rationaleEngine";
import {
  confidenceExplanation,
  getConfidenceTemplate,
  resolveConfidence,
} from "@/lib/confidenceEngine";
import type { RoleInferenceInput, RoleInferenceResult } from "@/types/role-inference";
import type { CategoryRoleId, ItemRoleMixEntry } from "@/types/role-inference";

function normalizeHint(hint: string): string {
  return hint.trim().toLowerCase();
}

function matchesSignals(hint: string, signals: string[]): boolean {
  if (!hint) return false;
  return signals.some((s) => hint.includes(s.toLowerCase()));
}

function findMatchingRule(input: RoleInferenceInput) {
  const hint = normalizeHint(input.categoryHint ?? "");
  if (!hint) return null;
  return (
    ROLE_INFERENCE_RULES.find(
      (r) =>
        r.retailerArchetype === input.archetypeId &&
        matchesSignals(hint, r.categorySignals),
    ) ?? null
  );
}

function defaultCategoryRole(archetypeId: import("@/types/retailer-archetypes").RetailerArchetypeId): CategoryRoleId {
  const archetype = RETAILER_ARCHETYPE_BY_ID.get(archetypeId);
  return archetype?.expectedCategoryRoles[0] ?? "basket_builder";
}

function defaultItemMix(archetypeId: import("@/types/retailer-archetypes").RetailerArchetypeId): ItemRoleMixEntry[] {
  const archetype = RETAILER_ARCHETYPE_BY_ID.get(archetypeId);
  if (!archetype) {
    return [
      { roleId: "kvi", sharePctMin: 8, sharePctMax: 12, label: "8–12% KVI" },
      { roleId: "foreground", sharePctMin: 25, sharePctMax: 25, label: "25% Foreground" },
      { roleId: "background", sharePctMin: 63, sharePctMax: 67, label: "remainder Background" },
    ];
  }
  return archetype.expectedItemRoleMix.map((m) => {
    const nums = m.typicalSharePct.match(/(\d+)/g);
    const min = nums ? Number(nums[0]) : 10;
    const max = nums && nums.length > 1 ? Number(nums[1]) : min;
    return {
      roleId: m.roleId,
      sharePctMin: min,
      sharePctMax: max,
      label: `${m.typicalSharePct} ${m.roleId.replace("_", " ")}`,
    };
  });
}

export function inferRoles(input: RoleInferenceInput): RoleInferenceResult {
  const archetype = RETAILER_ARCHETYPE_BY_ID.get(input.archetypeId);
  const rule = findMatchingRule(input);
  const categoryRoleId = rule?.suggestedCategoryRole ?? defaultCategoryRole(input.archetypeId);
  const itemMix = rule?.suggestedItemRoleMix ?? defaultItemMix(input.archetypeId);
  const role = CATEGORY_ROLE_BY_ID.get(categoryRoleId);
  const hasHint = Boolean(input.categoryHint?.trim());
  const hasMatch = Boolean(rule);

  const confidence = resolveConfidence(
    hasMatch,
    hasHint,
    archetype,
    input.pricingPosture,
    input.strategicObjectives.length,
  );

  const rationaleTemplate = resolveRationaleTemplate(rule?.rationaleTemplate);
  const categoryRationale = buildCategoryRationale(
    categoryRoleId,
    input.archetypeId,
    rule?.rationaleTemplate,
    input.strategicObjectives,
  );
  const itemRationale = buildItemMixRationale(input.archetypeId, categoryRoleId);

  return {
    archetypeId: input.archetypeId,
    archetypeName: archetype?.archetypeName ?? input.archetypeId,
    pricingPosture: input.pricingPosture,
    categoryHint: input.categoryHint?.trim() || null,
    categorySuggestion: {
      roleId: categoryRoleId,
      roleName: role?.roleName ?? categoryRoleId,
      confidence,
      rationale: categoryRationale,
      templateId: rule?.rationaleTemplate,
    },
    itemMixSuggestion: {
      mix: itemMix,
      confidence,
      rationale: `${itemRationale} ${confidenceExplanation(confidence, rule?.confidenceMethod ?? "archetype_default")}`,
    },
    appliedRuleId: rule?.id ?? null,
    overrideNote:
      "Inference is illustrative and overrideable. No pricing recommendation or benchmark verdict.",
    confidenceTemplate: getConfidenceTemplate(confidence),
    rationaleTemplate,
  };
}
