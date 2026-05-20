import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import type { WorkflowStep } from "@/types/ui";

type AppShellProps = {
  children: ReactNode;
  activeStep?: WorkflowStep;
};

export function AppShell({ children, activeStep = "context" }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeStep={activeStep} />
      <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">{children}</div>
    </div>
  );
}
