import {
  EMAIL_CLOSING,
  EMAIL_NEXT_STEP,
  EMAIL_OPPORTUNITY_FRAMING,
  EMAIL_PARTNER_OPENERS,
  EMAIL_THEME_BRIDGE,
} from "@/data/export/emailTemplates";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExecutiveEmail } from "@/types/executive-email";

function pickOpener(retailerName: string): string {
  const idx = retailerName.length % EMAIL_PARTNER_OPENERS.length;
  return EMAIL_PARTNER_OPENERS[idx] ?? EMAIL_PARTNER_OPENERS[0];
}

export function buildExecutiveEmail(
  readout: DiagnosticReadout,
  retailerName: string,
): ExecutiveEmail {
  const displayName = retailerName.trim() || "the team";
  const topThemes = readout.executiveSummary.topThemes
    .slice(0, 2)
    .map((t) => t.themeName);

  const themeText =
    topThemes.length > 0
      ? `${EMAIL_THEME_BRIDGE} ${topThemes.join(" and ")}.`
      : "The diagnostic surfaces several structural themes worth leadership attention.";

  const opportunitySummary = [
    readout.executiveSummary.marginOpportunitySummary,
    readout.opportunityDetail.totalMarginOpportunityRange
      ? `Directional margin opportunity: ${readout.opportunityDetail.totalMarginOpportunityRange}.`
      : "",
    EMAIL_OPPORTUNITY_FRAMING,
  ]
    .filter(Boolean)
    .join(" ");

  const executiveSummary = [
    pickOpener(retailerName),
    readout.executiveSummary.executiveNarrative.split(".").slice(0, 2).join(".") + ".",
    themeText,
  ].join(" ");

  return {
    subject: `Initial pricing diagnostic observations — ${retailerName || "client"}`,
    greeting: `Dear ${displayName},`,
    executiveSummary,
    topThemes,
    opportunitySummary,
    nextStepFraming: EMAIL_NEXT_STEP,
    closing: EMAIL_CLOSING,
  };
}

export function formatExecutiveEmailPlainText(email: ExecutiveEmail): string {
  return [
    email.greeting,
    "",
    email.executiveSummary,
    "",
    email.topThemes.length > 0
      ? `Key themes: ${email.topThemes.join("; ")}`
      : "",
    "",
    email.opportunitySummary,
    "",
    email.nextStepFraming,
    "",
    email.closing,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
