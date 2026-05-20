import { PLACEHOLDER_DIAGNOSTIC_OUTPUT } from "@/data/placeholderDiagnosticOutput";
import { getRuleLibrary } from "@/lib/rules/ruleLibrary";
import type { DiagnosticRunOutput } from "@/types/diagnostic-output";
import type { EngineRunInput, EngineRunResult } from "@/types/rules";

/**
 * Deterministic engine shell. Returns pending/null outputs until rules,
 * thresholds, and formulas are explicitly aligned and implemented.
 */
export function runDiagnosticEngine(
  input: EngineRunInput,
): EngineRunResult & { output: DiagnosticRunOutput } {
  getRuleLibrary();
  const output = PLACEHOLDER_DIAGNOSTIC_OUTPUT;

  const blockedReasons: string[] = [];
  if (!input.scopeDefined) {
    blockedReasons.push("Scope not defined");
  }
  if (!input.uploadsPresent) {
    blockedReasons.push("Client uploads not available");
  }
  if (!input.rulesApproved) {
    blockedReasons.push("Diagnostic rules not aligned");
  }

  const message =
    blockedReasons.length > 0
      ? `Engine pending alignment: ${blockedReasons.join("; ")}`
      : "Engine scaffold active — calculations remain disabled pending alignment";

  return {
    runId: input.runId,
    status: "pending_alignment",
    message,
    opportunityAmount: null,
    findingsCount: 0,
    rulesEvaluated: 0,
    output: {
      ...output,
      runId: input.runId,
      status: "analysis_pending",
    },
  };
}
