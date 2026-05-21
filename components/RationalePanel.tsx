import { Card } from "@/components/Card";

type RationalePanelProps = {
  title?: string;
  rationale: string;
  templateName?: string;
};

export function RationalePanel({
  title = "Rationale",
  rationale,
  templateName,
}: RationalePanelProps) {
  return (
    <Card className="border-l-4 border-l-[var(--accent)]">
      <p className="micro-label mb-2">{title}</p>
      {templateName && (
        <p className="text-xs text-[var(--text-muted)]">
          Template: {templateName}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-navy)]">
        {rationale}
      </p>
    </Card>
  );
}
