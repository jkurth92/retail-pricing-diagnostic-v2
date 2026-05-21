import { CATEGORY_ROLE_BY_ID } from "@/data/categoryRoles";
import { resolveRetailerLookup } from "@/lib/retailerLookup";
import type { InferredCategoryRow } from "@/types/category-scope";
import type { CategoryRoleId } from "@/types/role-inference";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type InferCategoryRolesInput = {
  archetypeId: RetailerArchetypeId;
  retailerName?: string;
  ticker?: string | null;
  uploadedFileNames?: string[];
};

let rowId = 0;

function nextRowId(): string {
  rowId += 1;
  return `cat-row-${rowId}`;
}

function row(category: string, roleId: CategoryRoleId): InferredCategoryRow {
  return { id: nextRowId(), category, roleId };
}

type CategoryTemplate = { category: string; roleId: CategoryRoleId };

const BY_TICKER: Record<string, CategoryTemplate[]> = {
  TGT: [
    { category: "Grocery", roleId: "traffic_driver" },
    { category: "Household essentials", roleId: "basket_builder" },
    { category: "Beauty", roleId: "premiumization" },
    { category: "Pet", roleId: "basket_builder" },
    { category: "Apparel", roleId: "premiumization" },
    { category: "Home decor", roleId: "opportunistic_seasonal" },
    { category: "Electronics", roleId: "profit_driver" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  WMT: [
    { category: "Grocery", roleId: "traffic_driver" },
    { category: "Household essentials", roleId: "traffic_driver" },
    { category: "Health & wellness", roleId: "basket_builder" },
    { category: "General merchandise", roleId: "profit_driver" },
    { category: "Apparel", roleId: "opportunistic_seasonal" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  KR: [
    { category: "Grocery", roleId: "traffic_driver" },
    { category: "Produce", roleId: "destination" },
    { category: "Dairy", roleId: "traffic_driver" },
    { category: "Center store", roleId: "basket_builder" },
    { category: "Health & beauty", roleId: "profit_driver" },
    { category: "Fuel & convenience", roleId: "convenience_urgency" },
  ],
  COST: [
    { category: "Bulk grocery", roleId: "basket_builder" },
    { category: "Household essentials", roleId: "traffic_driver" },
    { category: "Electronics", roleId: "profit_driver" },
    { category: "Apparel", roleId: "opportunistic_seasonal" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  BBY: [
    { category: "Consumer electronics", roleId: "destination" },
    { category: "Appliances", roleId: "profit_driver" },
    { category: "Computing", roleId: "traffic_driver" },
    { category: "Services & plans", roleId: "profit_driver" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  AMZN: [
    { category: "Marketplace core", roleId: "traffic_driver" },
    { category: "Consumables", roleId: "basket_builder" },
    { category: "Electronics", roleId: "profit_driver" },
    { category: "Apparel", roleId: "premiumization" },
    { category: "Prime / loyalty", roleId: "profit_driver" },
  ],
  DG: [
    { category: "Household essentials", roleId: "traffic_driver" },
    { category: "Pantry", roleId: "basket_builder" },
    { category: "Health & beauty", roleId: "profit_driver" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  DLTR: [
    { category: "Household essentials", roleId: "traffic_driver" },
    { category: "Pantry", roleId: "basket_builder" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
    { category: "Party & celebration", roleId: "opportunistic_seasonal" },
  ],
};

const BY_ARCHETYPE: Record<RetailerArchetypeId, CategoryTemplate[]> = {
  grocery: [
    { category: "Milk", roleId: "traffic_driver" },
    { category: "Produce", roleId: "destination" },
    { category: "Snacks", roleId: "basket_builder" },
    { category: "Household cleaners", roleId: "basket_builder" },
    { category: "Health & beauty", roleId: "profit_driver" },
  ],
  mass: [
    { category: "Grocery", roleId: "traffic_driver" },
    { category: "Household essentials", roleId: "basket_builder" },
    { category: "Beauty", roleId: "premiumization" },
    { category: "Apparel", roleId: "premiumization" },
    { category: "Home", roleId: "opportunistic_seasonal" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  discount: [
    { category: "Household essentials", roleId: "traffic_driver" },
    { category: "Pantry", roleId: "basket_builder" },
    { category: "Health & beauty", roleId: "profit_driver" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  premium_grocery: [
    { category: "Produce", roleId: "destination" },
    { category: "Prepared foods", roleId: "destination" },
    { category: "Organic", roleId: "premiumization" },
    { category: "Wine", roleId: "premiumization" },
    { category: "Milk", roleId: "traffic_driver" },
  ],
  specialty: [
    { category: "Core specialty", roleId: "destination" },
    { category: "Accessories", roleId: "basket_builder" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
  apparel_softlines: [
    { category: "Basics", roleId: "traffic_driver" },
    { category: "Seasonal apparel", roleId: "opportunistic_seasonal" },
    { category: "Accessories", roleId: "basket_builder" },
    { category: "Premium brands", roleId: "premiumization" },
  ],
  convenience: [
    { category: "Beverages", roleId: "convenience_urgency" },
    { category: "Impulse snacks", roleId: "convenience_urgency" },
    { category: "Tobacco", roleId: "profit_driver" },
  ],
  club: [
    { category: "Bulk grocery", roleId: "basket_builder" },
    { category: "Household", roleId: "traffic_driver" },
    { category: "Electronics", roleId: "profit_driver" },
    { category: "Seasonal", roleId: "opportunistic_seasonal" },
  ],
};

const FILE_CATEGORY_HINTS: { pattern: RegExp; category: string; roleId: CategoryRoleId }[] = [
  { pattern: /beauty|cosmetic/i, category: "Beauty", roleId: "premiumization" },
  { pattern: /grocery|food|dairy|produce/i, category: "Grocery", roleId: "traffic_driver" },
  { pattern: /apparel|fashion|clothing/i, category: "Apparel", roleId: "premiumization" },
  { pattern: /home|decor|furniture/i, category: "Home decor", roleId: "opportunistic_seasonal" },
  { pattern: /pet/i, category: "Pet", roleId: "basket_builder" },
  { pattern: /electronic|tech/i, category: "Electronics", roleId: "profit_driver" },
  { pattern: /promo/i, category: "Promotional categories", roleId: "opportunistic_seasonal" },
];

function resolveTicker(input: InferCategoryRolesInput): string | null {
  if (input.ticker?.trim()) return input.ticker.trim().toUpperCase();
  if (input.retailerName?.trim()) {
    return resolveRetailerLookup(input.retailerName).ticker;
  }
  return null;
}

function categoriesFromFileHints(fileNames: string[]): CategoryTemplate[] {
  const found: CategoryTemplate[] = [];
  const seen = new Set<string>();
  for (const name of fileNames) {
    for (const hint of FILE_CATEGORY_HINTS) {
      if (hint.pattern.test(name) && !seen.has(hint.category)) {
        seen.add(hint.category);
        found.push({ category: hint.category, roleId: hint.roleId });
      }
    }
  }
  return found;
}

function mergeTemplates(
  primary: CategoryTemplate[],
  extra: CategoryTemplate[],
): CategoryTemplate[] {
  const seen = new Set<string>();
  const merged: CategoryTemplate[] = [];
  for (const t of [...primary, ...extra]) {
    const key = t.category.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(t);
  }
  return merged;
}

export function inferCategoryRoles(input: InferCategoryRolesInput): InferredCategoryRow[] {
  rowId = 0;
  const ticker = resolveTicker(input);
  const fromTicker = ticker ? BY_TICKER[ticker] : null;
  const fromArchetype = BY_ARCHETYPE[input.archetypeId] ?? BY_ARCHETYPE.mass;
  const fromFiles = categoriesFromFileHints(input.uploadedFileNames ?? []);

  const template = mergeTemplates(fromTicker ?? fromArchetype, fromFiles);
  return template.map((t) => row(t.category, t.roleId));
}

/** @deprecated Use inferCategoryRoles */
export function inferCategoryRolesForArchetype(
  archetypeId: RetailerArchetypeId,
): InferredCategoryRow[] {
  return inferCategoryRoles({ archetypeId });
}

export function categoryRoleDisplayName(roleId: CategoryRoleId): string {
  const role = CATEGORY_ROLE_BY_ID.get(roleId);
  if (!role) return roleId;
  if (roleId === "opportunistic_seasonal") return "Opportunistic / seasonal";
  return role.roleName;
}

export const CATEGORY_ROLE_OPTIONS = Array.from(CATEGORY_ROLE_BY_ID.values()).map(
  (r) => ({
    id: r.id,
    label:
      r.id === "opportunistic_seasonal"
        ? "Opportunistic / seasonal"
        : r.roleName,
  }),
);
