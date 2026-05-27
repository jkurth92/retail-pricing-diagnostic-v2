"use client";

import { useRef, useState } from "react";
import { parseUploadFiles } from "@/lib/parseUploadHeaders";

type SimplifiedUploadPanelProps = {
  maxFiles?: number;
  onFilesChange?: (
    count: number,
    names: string[],
    detectedColumns: string[],
    productNameSample: string[],
  ) => void;
};

export function SimplifiedUploadPanel({
  maxFiles = 2,
  onFilesChange,
}: SimplifiedUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, maxFiles);
    const names = selected.map((f) => f.name);
    setFileNames(names);
    const { detectedColumns, productNameSample } = await parseUploadFiles(selected);
    onFilesChange?.(names.length, names, detectedColumns, productNameSample);
  };

  return (
    <div className="simplified-upload">
      <div
        className="upload-dropzone"
        role="region"
        aria-label="Upload pricing files"
      >
        <p className="text-sm font-medium text-[var(--text-navy)]">
          Drop pricing files here, or browse
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Price lists, promo calendars, or combined exports
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]"
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
        <ul className="mt-4 space-y-1 text-sm text-[var(--text-navy)]">
          {fileNames.map((name) => (
            <li key={name} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
