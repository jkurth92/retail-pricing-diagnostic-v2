"use client";

import { useId, useState, type ReactNode } from "react";

type DisclosureProps = {
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "subtle";
  className?: string;
};

export function Disclosure({
  title,
  summary,
  children,
  defaultOpen = false,
  variant = "default",
  className = "",
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  const border =
    variant === "subtle"
      ? "border-transparent bg-[var(--surface-muted)]"
      : "border-[var(--border)] bg-[var(--surface)]";

  return (
    <div className={`rounded-lg border ${border} ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="text-sm font-medium text-[var(--text-navy)]">
            {title}
          </span>
          {summary && !open && (
            <span className="mt-1 block text-sm text-[var(--text-muted)] line-clamp-2">
              {summary}
            </span>
          )}
        </span>
        <span
          className="shrink-0 text-[var(--text-muted)] transition-transform"
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          id={panelId}
          className="border-t border-[var(--border)] px-5 pb-5 pt-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}
