import type { WorkflowTab } from "@/types/ui";

type WorkflowTabsProps = {
  active: WorkflowTab;
  onChange: (tab: WorkflowTab) => void;
};

const TABS: { id: WorkflowTab; label: string }[] = [
  { id: "clientContext", label: "Client Context" },
  { id: "scope", label: "Scope of Diagnostic" },
  { id: "retailerOverview", label: "Retailer Overview" },
  { id: "opportunitySize", label: "Opportunity Size" },
];

export function WorkflowTabs({ active, onChange }: WorkflowTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {TABS.map((tab) => {
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
