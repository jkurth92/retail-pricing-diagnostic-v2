type StatusPillProps = {
  label: string;
  value: string;
};

export function StatusPill({ label, value }: StatusPillProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow)]">
      <p className="micro-label mb-1">{label}</p>
      <p className="text-sm font-medium text-[var(--text-navy)]">{value}</p>
    </div>
  );
}
