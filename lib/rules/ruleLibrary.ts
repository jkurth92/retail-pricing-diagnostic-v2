import { RULE_LIBRARY_PLACEHOLDER } from "@/data/ruleLibraryPlaceholder";
import type { RuleLibrary } from "@/types/rules";

/** Returns the disabled rule library scaffold. No rules are evaluated. */
export function getRuleLibrary(): RuleLibrary {
  return RULE_LIBRARY_PLACEHOLDER;
}

/** Rules that could run after alignment — currently none are active. */
export function getActiveRules() {
  return getRuleLibrary().rules.filter((rule) => rule.status === "disabled");
}
