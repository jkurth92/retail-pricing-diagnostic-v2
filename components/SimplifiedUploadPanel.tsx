"use client";

import { useMemo, useRef, useState } from "react";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { formatReadinessState } from "@/lib/readinessDisplay";

type SimplifiedUploadPanelProps = {
  maxFiles?: number;
  onFilesChange?: (count: number, names: string[]) => void;
};

export function SimplifiedUploadPanel({
  maxFiles = 2,
  onFilesChange,
}: SimplifiedUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const dataset = useMemo(() => buildPlaceholderIngestionDataset(), []);
  const readiness = formatReadinessState(dataset.readinessSummary);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files)
      .slice(0, maxFiles)
      .map((f) => f.name);
    setFileNames(names);
    onFilesChange?.(names.length, names);
  };

  return (
    <div className="simplified-upload space-y-6">
      <div
        className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-10 text-center"
        role="region"
        aria-label="Upload pricing files"
      >
        <p className="text-sm font-medium text-[var(--text-navy)]">
          Drop pricing files here, or browse
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          One or two files (price lists, promo calendars, or combined exports).
          Format is inferred automatically.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".csv,.xlsx,.xls,.txt"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {fileNames.length > 0 && (
        <ul className="text-sm text-[var(--text-navy)]">
          {fileNames.map((name) => (
            <li key={name} className="flex items-center gap-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {name}
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 text-sm">
        <p className="font-semibold text-[var(--text-navy)]">What we inferred</p>
        <ul className="mt-3 space-y-2 text-[var(--text-muted)]">
          <li>
            Data readiness: <span className="text-[var(--text-navy)]">{readiness}</span>
          </li>
          <li>
            Likely categories:{" "}
            <span className="text-[var(--text-navy)]">
              {dataset.normalizedFields.slice(0, 4).join(", ").replace(/_/g, " ") ||
                "Pending file review"}
            </span>
          </li>
          <li>
            Diagnostics available:{" "}
            <span className="text-[var(--text-navy)]">
              Architecture, KVI, promotions (thematic)
            </span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Preview only — files are not stored. Confirm scope below before running the
          assessment.
        </p>
      </div>
    </div>
  );
}
