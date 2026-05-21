import type { ExecutiveMemo } from "@/types/executive-memo";
import type { PresentationExport } from "@/types/presentation-export";

export async function downloadExecutiveMemoDocx(memo: ExecutiveMemo): Promise<void> {
  const response = await fetch("/api/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memo),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to download memo",
    );
  }
  await saveBlobResponse(response, "executive-memo.docx");
}

export async function downloadPresentationPptx(
  presentation: PresentationExport,
  slideIds?: string[],
): Promise<void> {
  const response = await fetch("/api/export/pptx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ presentation, slideIds }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to download deck",
    );
  }
  await saveBlobResponse(response, "pricing-diagnostic-deck.pptx");
}

async function saveBlobResponse(response: Response, fallbackName: string): Promise<void> {
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function copyExecutiveEmailToClipboard(body: string): Promise<void> {
  return navigator.clipboard.writeText(body);
}
