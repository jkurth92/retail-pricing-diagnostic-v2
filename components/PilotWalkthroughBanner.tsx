"use client";

import { PILOT_DEMO_PRESET } from "@/data/pilotDemo";

type PilotWalkthroughBannerProps = {
  onStartDemo: () => void;
  demoActive: boolean;
};

export function PilotWalkthroughBanner({
  onStartDemo,
  demoActive,
}: PilotWalkthroughBannerProps) {
  return (
    <div className="pilot-banner">
      <div className="pilot-banner-inner">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Pilot walkthrough
          </p>
          <p className="mt-1 text-sm text-[var(--text-navy)]">
            {demoActive
              ? `Demo loaded: ${PILOT_DEMO_PRESET.retailerName}. Review the five-step journey, then generate the diagnostic.`
              : "Load a seeded retailer example to pressure-test pacing and narrative before a live upload."}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartDemo}
          className="shrink-0 rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]"
        >
          {demoActive ? "Reload demo" : "Start pilot demo"}
        </button>
      </div>
    </div>
  );
}
