"use client";

import { downloadPresentationPptx } from "@/lib/export/downloadClient";
import { collectSlidesForExport } from "@/lib/export/presentationGenerator";
import type { PresentationExport } from "@/types/presentation-export";
import { useState } from "react";

type SlidePreviewPanelProps = {
  presentation: PresentationExport;
};

export function SlidePreviewPanel({ presentation }: SlidePreviewPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slides = collectSlidesForExport(presentation);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      await downloadPresentationPptx(presentation);
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
            LOP-ready deck draft
          </p>
          <h4 className="mt-1 text-base font-semibold text-[var(--text-navy)]">
            {presentation.presentationTitle}
          </h4>
        </div>
        <button
          type="button"
          disabled={loading}
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => void handleDownload()}
        >
          {loading ? "Generating…" : "Download PPTX"}
        </button>
      </header>
      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <ol className="mt-4 space-y-4">
        {slides.map((slide, index) => (
          <li
            key={slide.id}
            className="rounded-lg border border-[var(--border)] p-4"
          >
            <p className="text-xs text-[var(--text-muted)]">
              Slide {index + 1} · {slide.id}
            </p>
            <h5 className="mt-1 font-semibold text-[var(--text-navy)]">
              {slide.slideTitle}
            </h5>
            <p className="mt-2 text-sm font-medium text-[var(--accent)]">
              {slide.headline}
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--text-navy)]">
              {slide.bodyBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="mt-3 rounded-md bg-[var(--surface-muted)] p-3 text-xs leading-relaxed text-[var(--text-navy)]">
              {slide.rhsCallout}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
