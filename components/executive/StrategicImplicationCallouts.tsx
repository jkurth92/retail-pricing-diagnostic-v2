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
    <div className="ent-implication-stack">
      {items.map((imp) => (
        <div key={imp} className="ent-implication-card">
          <span className="ent-implication-accent" aria-hidden />
          <p className="ent-implication-text">{imp}</p>
        </div>
      ))}
    </div>
  );
}
