"use client";

import { downloadExecutiveMemoDocx } from "@/lib/export/downloadClient";
import type { ExecutiveMemo } from "@/types/executive-memo";
import { useState } from "react";

type ExecutiveMemoPreviewProps = {
  memo: ExecutiveMemo;
};

export function ExecutiveMemoPreview({ memo }: ExecutiveMemoPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      await downloadExecutiveMemoDocx(memo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="export-preview-card">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Executive memo
          </p>
          <h4 className="mt-1 text-base font-semibold text-[var(--text-navy)]">
            {memo.title}
          </h4>
        </div>
        <button
          type="button"
          disabled={loading}
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => void handleDownload()}
        >
          {loading ? "Generating…" : "Download DOCX"}
        </button>
      </header>
      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <section className="mt-4 space-y-5 text-sm leading-relaxed text-[var(--text-navy)]">
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Retailer context
          </h5>
          <p className="mt-2 whitespace-pre-line">{memo.retailerContext}</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            What we observed in the pricing review
          </h5>
          <p className="mt-2 whitespace-pre-line">{memo.pricingObservations}</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            What it implies
          </h5>
          <p className="mt-2 whitespace-pre-line">{memo.implications}</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Questions to discuss with leadership
          </h5>
          <ul className="mt-2 list-disc pl-5">
            {memo.discussionQuestions.map((q) => (
              <li key={q} className="mt-1">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
