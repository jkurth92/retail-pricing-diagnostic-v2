"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { createUserCompetitor } from "@/lib/competitors";
import type { CompetitorEntry } from "@/types/competitors";

type CompetitorSuggestionPanelProps = {
  competitors: CompetitorEntry[];
  onCompetitorsChange: (competitors: CompetitorEntry[]) => void;
};

export function CompetitorSuggestionPanel({
  competitors,
  onCompetitorsChange,
}: CompetitorSuggestionPanelProps) {
  const [newCompetitorName, setNewCompetitorName] = useState("");

  const addCompetitor = () => {
    const trimmed = newCompetitorName.trim();
    if (!trimmed) return;
    if (competitors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewCompetitorName("");
      return;
    }
    onCompetitorsChange([...competitors, createUserCompetitor(trimmed)]);
    setNewCompetitorName("");
  };

  const removeCompetitor = (id: string) => {
    onCompetitorsChange(competitors.filter((c) => c.id !== id));
  };

  const togglePeerSelection = (id: string) => {
    onCompetitorsChange(
      competitors.map((c) =>
        c.id === id ? { ...c, selectedForPeerView: !c.selectedForPeerView } : c,
      ),
    );
  };

  return (
    <Card>
      <p className="micro-label mb-2">Competitive set</p>
      <h3 className="section-title">Competitor suggestions</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Suggestions are derived from local seed data by retailer format. They
        are not externally validated and are used for retailer overview context
        only. They do not affect opportunity sizing.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--border)] bg-[var(--app-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
          Suggested
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--app-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
          Requires validation
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--app-bg)] px-3 py-1 text-xs text-[var(--text-muted)]">
          Used for overview only
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {competitors.length === 0 ? (
          <li className="text-sm text-[var(--text-muted)]">
            Populate retailer data to load format-based suggestions, or add
            competitors manually.
          </li>
        ) : (
          competitors.map((competitor) => (
            <li
              key={competitor.id}
              className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-navy)]">
                  {competitor.name}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {competitor.source === "suggested"
                    ? "Suggested — requires validation"
                    : "User added — requires validation"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--text-navy)]">
                  <input
                    type="checkbox"
                    checked={competitor.selectedForPeerView}
                    onChange={() => togglePeerSelection(competitor.id)}
                    className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  Selected for peer view
                </label>
                <button
                  type="button"
                  onClick={() => removeCompetitor(competitor.id)}
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={newCompetitorName}
          onChange={(e) => setNewCompetitorName(e.target.value)}
          placeholder="Add competitor name"
          className="flex-1 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={addCompetitor}
          className="shrink-0 rounded-md border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]"
        >
          Add competitor
        </button>
      </div>
    </Card>
  );
}
