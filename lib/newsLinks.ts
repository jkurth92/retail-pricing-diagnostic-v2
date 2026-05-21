import type { NewsSummary } from "@/types/context-enrichment";

/** Resolve a direct article URL — only returns live http(s) links from enrichment data. */
export function resolveNewsArticleUrl(item: NewsSummary): string | null {
  const url = item.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return url;
}

export function formatNewsSourceLabel(source: string): string {
  const cleaned = source
    .replace(/curated reference/gi, "Industry coverage")
    .replace(/\s*\(reference\)/gi, "")
    .trim();
  return cleaned || "Industry coverage";
}
