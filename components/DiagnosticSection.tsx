import type { ReactNode } from "react";

type DiagnosticSectionProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

export function DiagnosticSection({
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: DiagnosticSectionProps) {
  return (
    <section className={`diagnostic-section ${className}`.trim()}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-heading">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
      <div className="section-body">{children}</div>
    </section>
  );
}
