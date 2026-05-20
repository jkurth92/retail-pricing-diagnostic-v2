"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { DIAGNOSTIC_LEVERS, type DiagnosticLever } from "@/types/ui";

export function ScopePanel() {
  const [revenueInScope, setRevenueInScope] = useState("");
  const [selectedLevers, setSelectedLevers] = useState<Set<DiagnosticLever>>(
    () => new Set(DIAGNOSTIC_LEVERS),
  );

  const toggleLever = (lever: DiagnosticLever) => {
    setSelectedLevers((prev) => {
      const next = new Set(prev);
      if (next.has(lever)) {
        next.delete(lever);
      } else {
        next.add(lever);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <p className="micro-label mb-2">Diagnostic scope</p>
        <h3 className="section-title">Scope of Diagnostic</h3>
        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="revenue-in-scope"
              className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
            >
              Revenue in scope
            </label>
            <input
              id="revenue-in-scope"
              type="text"
              value={revenueInScope}
              onChange={(e) => setRevenueInScope(e.target.value)}
              placeholder="e.g. $2.4B annual revenue"
              className="w-full max-w-md rounded-md border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text-navy)]">
              Category inclusion / exclusion
            </p>
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--app-bg)] px-5 py-8 text-sm text-[var(--text-muted)]">
              Category filters placeholder — requires alignment before
              implementation.
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--text-navy)]">
              Diagnostic levers
            </p>
            <div className="flex flex-wrap gap-4">
              {DIAGNOSTIC_LEVERS.map((lever) => (
                <label
                  key={lever}
                  className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-navy)]"
                >
                  <input
                    type="checkbox"
                    checked={selectedLevers.has(lever)}
                    onChange={() => toggleLever(lever)}
                    className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  {lever}
                </label>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 rounded-md border border-[var(--border)] bg-[var(--accent-light)] px-4 py-3 text-sm text-[var(--text-navy)]">
          Diagnostic rules and benchmark assumptions will be configured after
          alignment.
        </p>
      </Card>
    </div>
  );
}
