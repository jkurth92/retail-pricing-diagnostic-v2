import type { WorkflowTab } from "@/types/ui";
import { WORKFLOW_TABS } from "@/types/ui";

type WorkflowTabsProps = {
  active: WorkflowTab;
  onChange: (tab: WorkflowTab) => void;
};

export function WorkflowTabs({ active, onChange }: WorkflowTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {WORKFLOW_TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-navy)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
