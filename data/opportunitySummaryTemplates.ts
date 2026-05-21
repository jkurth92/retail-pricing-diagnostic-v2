export const OPPORTUNITY_CAVEATS = [
  "Ranges represent recoverable strategic value pools, not optimized price changes.",
  "Overlapping themes are aggregated with a non-additive overlap factor — not a sum of independent initiatives.",
  "Dollar opportunity requires scope denominator alignment and explicit rule activation.",
  "No competitor or benchmark thresholds applied in this build.",
];

export const OPPORTUNITY_STATUS_NOTES: Record<string, string> = {
  thematic_only:
    "Thematic margin framing active. Dollar sizing not calculated.",
  pending_scope_dollars:
    "Revenue in scope is set; dollar translation awaits aligned formulas.",
  insufficient_hypotheses:
    "Insufficient medium+ confidence hypotheses to form a storyline.",
};
