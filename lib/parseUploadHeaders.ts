import type { UploadProductRow } from "@/types/upload-products";

/** Parse the first line of a CSV/TXT upload into column header names. */
export function parseCsvHeaderLine(line: string): string[] {
  const headers: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i);
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      headers.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  headers.push(current.trim());
  return headers.filter(Boolean);
}

/** Read column headers from the start of a tabular upload (CSV/TXT). */
export async function extractUploadColumnHeaders(file: File): Promise<string[]> {
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".csv") && !lower.endsWith(".txt")) {
    return [];
  }

  const sample = await file.slice(0, 65_536).text();
  const firstLine =
    sample.split(/\r?\n/).find((line) => line.trim().length > 0) ?? "";
  return parseCsvHeaderLine(firstLine.replace(/^\uFEFF/, ""));
}

export async function extractColumnsFromFiles(files: File[]): Promise<string[]> {
  const merged = new Set<string>();
  for (const file of files) {
    const headers = await extractUploadColumnHeaders(file);
    for (const header of headers) {
      merged.add(header);
    }
  }
  return [...merged];
}

const PRODUCT_NAME_HEADER = /^(product_name|item_desc|item_description|product_desc|title|sku_desc)$/i;

function findProductNameColumnIndex(headers: string[]): number {
  const normalized = headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
  );
  let idx = normalized.findIndex((h) => PRODUCT_NAME_HEADER.test(h));
  if (idx >= 0) return idx;
  idx = normalized.findIndex((h) => h.includes("product") && h.includes("name"));
  return idx;
}

/** Sample product titles from tabular uploads for category inference. */
export async function extractProductNameSampleFromFiles(
  files: File[],
  maxRows = 200,
): Promise<string[]> {
  const samples: string[] = [];

  for (const file of files) {
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".csv") && !lower.endsWith(".txt")) continue;

    const text = await file.slice(0, 512_000).text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) continue;

    const headers = parseCsvHeaderLine(lines[0].replace(/^\uFEFF/, ""));
    const nameIdx = findProductNameColumnIndex(headers);
    if (nameIdx < 0) continue;

    const rowLimit = Math.min(lines.length, maxRows + 1);
    for (let i = 1; i < rowLimit; i++) {
      const cols = parseCsvHeaderLine(lines[i]);
      const name = cols[nameIdx]?.trim();
      if (name && name.length > 2) {
        samples.push(name);
      }
    }
  }

  return samples;
}

function parsePriceValue(raw: string | undefined): number | null {
  if (!raw?.trim() || /^null$/i.test(raw.trim())) return null;
  const n = Number.parseFloat(raw.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function findPriceColumnIndices(headers: string[]): {
  regularIdx: number;
  promoIdx: number;
} {
  const normalized = headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
  );
  const regularIdx = normalized.findIndex((h) =>
    /^(regular_price|reg_price|price|retail_price|shelf_price|list_price|base_price)$/.test(h),
  );
  const promoIdx = normalized.findIndex((h) =>
    /^(promo_price|promotional_price|sale_price|deal_price|ad_price)$/.test(h),
  );
  return { regularIdx, promoIdx };
}

/** Parse product name and prices from tabular uploads for SKU illustrations. */
export async function extractUploadProductRowsFromFiles(
  files: File[],
  maxRows = 400,
): Promise<UploadProductRow[]> {
  const rows: UploadProductRow[] = [];

  for (const file of files) {
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".csv") && !lower.endsWith(".txt")) continue;

    const text = await file.slice(0, 1_024_000).text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) continue;

    const headers = parseCsvHeaderLine(lines[0].replace(/^\uFEFF/, ""));
    const nameIdx = findProductNameColumnIndex(headers);
    if (nameIdx < 0) continue;

    const { regularIdx, promoIdx } = findPriceColumnIndices(headers);
    const rowLimit = Math.min(lines.length, maxRows + 1);

    for (let i = 1; i < rowLimit; i++) {
      const cols = parseCsvHeaderLine(lines[i]);
      const productName = cols[nameIdx]?.trim();
      if (!productName || productName.length < 3) continue;

      const regularPrice =
        regularIdx >= 0 ? parsePriceValue(cols[regularIdx]) : null;
      const promoPrice = promoIdx >= 0 ? parsePriceValue(cols[promoIdx]) : null;

      if (regularPrice == null && promoPrice == null) continue;

      rows.push({
        productName,
        regularPrice: regularPrice ?? promoPrice,
        promoPrice: promoPrice ?? null,
      });
    }
  }

  return rows;
}

export type UploadFileParseResult = {
  detectedColumns: string[];
  productNameSample: string[];
  productRows: UploadProductRow[];
};

export async function parseUploadFiles(files: File[]): Promise<UploadFileParseResult> {
  const [detectedColumns, productNameSample, productRows] = await Promise.all([
    extractColumnsFromFiles(files),
    extractProductNameSampleFromFiles(files),
    extractUploadProductRowsFromFiles(files),
  ]);
  return { detectedColumns, productNameSample, productRows };
}
