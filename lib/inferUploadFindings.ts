import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import type { LeverKey } from "@/types/diagnostic-output";

const LEVER_SHORT_LABEL: Record<LeverKey, string> = {
  kvis: "KVI",
  price_architecture: "Architecture",
  price_zoning: "Zoning",
  promotions: "Promotions",
  markdown: "Markdown",
};

export type UploadFindings = {
  detected: string[];
  diagnosticsAvailable: string[];
  hasFileSignal: boolean;
};

const BASE_DETECTED = [
  "Pricing structure",
  "Category hierarchy",
];

const WITH_FILES_DETECTED = [
  "Pricing structure",
  "Category hierarchy",
  "Store / zone information",
  "Promotional indicators",
];

export function inferUploadFindings(
  uploadedFileCount: number,
): UploadFindings {
  const hasFileSignal = uploadedFileCount > 0;
  const dataset = buildPlaceholderIngestionDataset();
  const unlocked = dataset.leverUnlocks
    .filter((u) => u.status === "available" || u.status === "ready")
    .map((u) => LEVER_SHORT_LABEL[u.leverKey]);

  const diagnosticsAvailable =
    unlocked.length > 0
      ? unlocked
      : hasFileSignal
        ? ["Architecture", "KVI", "Promotions"]
        : ["Architecture", "KVI"];

  return {
    detected: hasFileSignal ? WITH_FILES_DETECTED : BASE_DETECTED,
    diagnosticsAvailable,
    hasFileSignal,
  };
}
