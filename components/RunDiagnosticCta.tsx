"use client";

type RunDiagnosticCtaProps = {
  onRun: () => void;
  disabled?: boolean;
  disabledReason?: string;
  variant?: "primary" | "inline";
};

export function RunDiagnosticCta({
  onRun,
  disabled = false,
  disabledReason,
  variant = "primary",
}: RunDiagnosticCtaProps) {
  if (variant === "inline") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onRun}
        className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate pricing diagnostic
      </button>
    );
  }

  return (
    <div className="run-diagnostic-cta">
      <div className="run-diagnostic-cta-inner">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Ready when you are
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-navy)]">
          Run strategic pricing assessment
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
          Synthesizes structural themes, opportunity framing, and executive narrative
          from your retailer profile and uploaded data. Intentional — not generated
          until you confirm scope.
        </p>
        {disabledReason && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{disabledReason}</p>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={onRun}
          className="mt-6 rounded-md bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate pricing diagnostic
        </button>
      </div>
    </div>
  );
}
