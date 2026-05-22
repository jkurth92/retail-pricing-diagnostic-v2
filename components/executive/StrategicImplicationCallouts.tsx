"use client";

type StrategicImplicationCalloutsProps = {
  implications: string[];
  max?: number;
};

export function StrategicImplicationCallouts({
  implications,
  max = 3,
}: StrategicImplicationCalloutsProps) {
  const items = implications.slice(0, max);
  if (items.length === 0) return null;

  return (
    <div className="ent-implication-stack flex flex-col gap-3">
      {items.map((imp) => (
        <div
          key={imp}
          className="ent-implication-card flex items-start gap-3 rounded-xl border border-[var(--border)] bg-white p-4"
        >
          <span
            className="ent-implication-accent w-0.5 shrink-0 self-stretch rounded-full bg-gradient-to-b from-[var(--accent-mid)] to-[var(--accent-deep)]"
            aria-hidden
          />
          <p className="ent-implication-text m-0 text-sm font-medium leading-snug text-[var(--text-navy)]">
            {imp}
          </p>
        </div>
      ))}
    </div>
  );
}
