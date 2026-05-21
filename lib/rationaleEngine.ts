import { RATIONALE_TEMPLATE_BY_ID } from "@/data/rationaleTemplates";
import { CATEGORY_ROLE_BY_ID } from "@/data/categoryRoles";
import type { CategoryRoleId } from "@/types/role-inference";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type { RationaleTemplate } from "@/types/benchmark-concepts";

export function resolveRationaleTemplate(
  templateId: string | undefined,
): RationaleTemplate | null {
  if (!templateId) return null;
  return RATIONALE_TEMPLATE_BY_ID.get(templateId) ?? null;
}

export function buildCategoryRationale(
  roleId: CategoryRoleId,
  archetypeId: RetailerArchetypeId,
  templateId: string | undefined,
  objectives: StrategicObjectiveId[],
): string {
  const template = resolveRationaleTemplate(templateId);
  if (template) return template.rationaleText;

  const role = CATEGORY_ROLE_BY_ID.get(roleId);
  const base = role?.rationale ?? "Category role inferred from archetype defaults.";

  if (objectives.includes("value_perception") && roleId === "traffic_driver") {
    return `${base} Value perception objective reinforces traffic-driver signaling (descriptive).`;
  }
  if (objectives.includes("premiumization") && roleId === "premiumization") {
    return `${base} Premiumization objective aligns with tier-led architecture.`;
  }

  return `${base} (${archetypeId} archetype context).`;
}

export function buildItemMixRationale(
  archetypeId: RetailerArchetypeId,
  roleId: CategoryRoleId,
): string {
  return `Illustrative item role mix for ${CATEGORY_ROLE_BY_ID.get(roleId)?.roleName ?? roleId} in ${archetypeId} context. Override when client taxonomy differs.`;
}
