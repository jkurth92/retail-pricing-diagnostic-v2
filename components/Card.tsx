import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`card-surface p-6 ${className}`.trim()}>
      {children}
    </section>
  );
}
