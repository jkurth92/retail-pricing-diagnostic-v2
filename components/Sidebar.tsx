import type { WorkflowTab } from "@/types/ui";
import { WORKFLOW_TABS } from "@/types/ui";

type SidebarProps = {
  activeStep?: WorkflowTab;
  onNavigate?: (step: WorkflowTab) => void;
};

export function Sidebar({
  activeStep = "retailer_context",
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Pricing copilot
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--text-navy)]">
          Guided diagnostic
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Journey">
        <ul className="flex flex-col gap-0.5">
          {WORKFLOW_TABS.map((step, index) => {
            const isActive = step.id === activeStep;
            const className = `flex w-full items-start gap-2.5 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors ${
              isActive
                ? "bg-[var(--accent-light)] font-medium text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-navy)]"
            }`;

            const content = (
              <>
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block leading-snug">{step.label}</span>
                </span>
              </>
            );

            return (
              <li key={step.id}>
                {onNavigate ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(step.id)}
                    className={className}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {content}
                  </button>
                ) : (
                  <span className={className}>{content}</span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          Strategic pricing diagnostic — narrative-first, executive-ready.
        </p>
      </div>
    </aside>
  );
}
