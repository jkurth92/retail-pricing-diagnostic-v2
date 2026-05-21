"use client";

import { formatExecutiveEmailPlainText } from "@/lib/export/executiveEmailGenerator";
import { copyExecutiveEmailToClipboard } from "@/lib/export/downloadClient";
import type { ExecutiveEmail } from "@/types/executive-email";
import { useState } from "react";

type EmailPreviewPanelProps = {
  email: ExecutiveEmail;
};

export function EmailPreviewPanel({ email }: EmailPreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const body = formatExecutiveEmailPlainText(email);

  const handleCopy = async () => {
    await copyExecutiveEmailToClipboard(
      [`Subject: ${email.subject}`, "", body].join("\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="export-preview-card">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Partner email draft
          </p>
          <h4 className="mt-1 text-base font-semibold text-[var(--text-navy)]">
            {email.subject}
          </h4>
        </div>
        <button
          type="button"
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-navy)] hover:bg-[var(--surface-muted)]"
          onClick={() => void handleCopy()}
        >
          {copied ? "Copied" : "Copy draft"}
        </button>
      </header>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-[var(--surface-muted)] p-4 text-sm leading-relaxed text-[var(--text-navy)]">
        {body}
      </pre>
    </article>
  );
}
