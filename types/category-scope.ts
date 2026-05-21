import type { CategoryRoleId } from "@/types/role-inference";

export type InferredCategoryRow = {
  id: string;
  category: string;
  roleId: CategoryRoleId;
};
