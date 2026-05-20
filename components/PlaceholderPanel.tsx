import type { ReactNode } from "react";
import { Card } from "@/components/Card";

type PlaceholderPanelProps = {
  title: string;
  description?: string;
  note?: string;
  children?: ReactNode;
};

export function PlaceholderPanel({
  title,
  description,
  note,
  children,
}: PlaceholderPanelProps) {
  return (
    <Card>
      <h3 className="section-title">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
      ) : null}
      {children ? <div className="mt-6 space-y-4">{children}</div> : null}
      {note ? (
        <p className="mt-6 rounded-md border border-[var(--border)] bg-[var(--accent-light)] px-4 py-3 text-sm text-[var(--text-navy)]">
          {note}
        </p>
      ) : null}
    </Card>
  );
}
