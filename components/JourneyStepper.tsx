import type { WorkflowTab } from "@/types/ui";
import { WORKFLOW_TABS } from "@/types/ui";

type JourneyStepperProps = {
  active: WorkflowTab;
  onChange: (tab: WorkflowTab) => void;
};

export function JourneyStepper({ active, onChange }: JourneyStepperProps) {
  const activeIndex = WORKFLOW_TABS.findIndex((t) => t.id === active);

  return (
    <nav
      className="journey-stepper mb-10"
      aria-label="Diagnostic journey"
    >
      <ol className="journey-stepper-list">
        {WORKFLOW_TABS.map((tab, index) => {
          const isActive = tab.id === active;
          const isPast = index < activeIndex;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={`journey-step ${isActive ? "journey-step-active" : ""} ${isPast ? "journey-step-complete" : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="journey-step-index">{index + 1}</span>
                <span className="journey-step-text">
                  <span className="journey-step-label">{tab.label}</span>
                  {tab.description && (
                    <span className="journey-step-desc">{tab.description}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
