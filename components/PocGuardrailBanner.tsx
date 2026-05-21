import { POC_DISCLAIMER } from "@/data/presentationPlaceholders";

type PocGuardrailBannerProps = {
  title?: string;
  detail?: string;
  variant?: "accent" | "neutral";
};

export function PocGuardrailBanner({
  title = "Proof-of-concept diagnostic cockpit",
  detail = POC_DISCLAIMER,
  variant = "accent",
}: PocGuardrailBannerProps) {
  const styles =
    variant === "accent"
      ? "border-2 border-[var(--accent)] bg-[var(--accent-light)]"
      : "border border-[var(--border)] bg-[var(--surface-muted)]";

  return (
    <div className={`rounded-lg px-6 py-4 ${styles}`}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="shrink-0 rounded-full border border-[var(--accent)] bg-white px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--accent)]">
          POC
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text-navy)]">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}
