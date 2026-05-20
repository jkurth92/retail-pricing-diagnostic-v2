import type { PrimaryModule } from "@/types/ui";

type PrimaryTabsProps = {
  active: PrimaryModule;
  onChange: (module: PrimaryModule) => void;
};

const MODULES: { id: PrimaryModule; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "pricing", label: "Pricing" },
  { id: "promotions", label: "Promotions" },
  { id: "markdown", label: "Markdown" },
];

export function PrimaryTabs({ active, onChange }: PrimaryTabsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-1 border-b border-[var(--border)]">
      {MODULES.map((module) => {
        const isActive = module.id === active;
        return (
          <button
            key={module.id}
            type="button"
            onClick={() => onChange(module.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-navy)]"
            }`}
          >
            {module.label}
          </button>
        );
      })}
    </div>
  );
}
