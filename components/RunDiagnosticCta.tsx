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
        Generate strategic pricing assessment
      </button>
    );
  }

  return (
    <div className="run-diagnostic-cta">
      <div className="run-diagnostic-cta-inner">
        <h3 className="run-diagnostic-cta-title">
          Generate strategic pricing assessment
        </h3>
        <p className="run-diagnostic-cta-lead">
          Synthesizes structural themes and executive narrative from your retailer
          profile and uploaded data.
        </p>
        {disabledReason && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{disabledReason}</p>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={onRun}
          className="run-diagnostic-cta-button"
        >
          Run assessment
        </button>
      </div>
    </div>
  );
}
