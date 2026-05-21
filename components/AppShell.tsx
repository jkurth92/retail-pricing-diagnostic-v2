import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import type { WorkflowTab } from "@/types/ui";

type AppShellProps = {
  children: ReactNode;
  activeStep?: WorkflowTab;
  onNavigate?: (step: WorkflowTab) => void;
};

export function AppShell({
  children,
  activeStep = "client_context",
  onNavigate,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeStep={activeStep} onNavigate={onNavigate} />
      <div className="min-w-0 flex-1 px-6 py-8 lg:px-10 xl:px-12">{children}</div>
    </div>
  );
}
