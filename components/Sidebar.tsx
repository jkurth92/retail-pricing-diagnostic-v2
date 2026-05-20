import type { WorkflowStep } from "@/types/ui";

type SidebarProps = {
  activeStep?: WorkflowStep;
};

const FLOW_STEPS: { id: WorkflowStep; label: string }[] = [
  { id: "setup", label: "Setup" },
  { id: "context", label: "Context" },
  { id: "analysis", label: "Analysis" },
  { id: "opportunity", label: "Opportunity" },
];

export function Sidebar({ activeStep = "context" }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <p className="micro-label">Diagnostic flow</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-3 py-4">
        {FLOW_STEPS.map((step) => {
          const isActive = step.id === activeStep;
          return (
            <span
              key={step.id}
              className={`rounded-md px-3 py-2.5 text-sm ${
                isActive
                  ? "bg-[var(--accent-light)] font-medium text-[var(--accent)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {step.label}
            </span>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-[var(--border)] px-5 py-5">
        <p className="micro-label mb-2">History</p>
        <p className="text-sm text-[var(--text-navy)]">
          Latest run: <span className="font-medium">Ready</span>
        </p>
      </div>
    </aside>
  );
}
