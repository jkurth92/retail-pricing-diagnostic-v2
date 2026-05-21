"use client";

import { useState } from "react";
import {
  getPeerUnresolvedLabel,
  PEER_EXCLUDED_TOOLTIP,
  summarizeFinancePeers,
} from "@/lib/financePeerResolution";
import type { FinancePeer } from "@/types/finance-peers";

type FinancePeerEditorProps = {
  peers: FinancePeer[];
  onPeersChange: (peers: FinancePeer[]) => void;
  onAddPeer: (name: string) => void;
};

export function FinancePeerEditor({
  peers,
  onPeersChange,
  onAddPeer,
}: FinancePeerEditorProps) {
  const [draft, setDraft] = useState("");
  const { includedCount, contributingCount, excludedCount, excludedIncluded } =
    summarizeFinancePeers(peers);

  const toggleIncluded = (id: string) => {
    onPeersChange(
      peers.map((p) => (p.id === id ? { ...p, included: !p.included } : p)),
    );
  };

  const removePeer = (id: string) => {
    onPeersChange(peers.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAddPeer(draft.trim());
    setDraft("");
  };

  return (
    <div className="rc-peer-editor">
      <p className="text-sm text-[var(--text-muted)]">
        Suggested from sector and format. Edit the set for benchmarking only —
        not used in the pricing diagnostic.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {peers.map((peer) => {
          const unresolvedLabel = getPeerUnresolvedLabel(peer);
          return (
            <li
              key={peer.id}
              className={`rc-peer-chip ${peer.included ? "rc-peer-chip-active" : ""} ${
                unresolvedLabel ? "rc-peer-chip-unresolved" : ""
              }`}
              title={unresolvedLabel ? PEER_EXCLUDED_TOOLTIP : undefined}
            >
              <button
                type="button"
                onClick={() => toggleIncluded(peer.id)}
                className="font-medium"
              >
                {peer.name}
                {peer.ticker ? ` (${peer.ticker})` : ""}
              </button>
              {unresolvedLabel ? (
                <span
                  className="rc-peer-unresolved-badge"
                  title={PEER_EXCLUDED_TOOLTIP}
                >
                  {unresolvedLabel}
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove ${peer.name}`}
                onClick={() => removePeer(peer.id)}
                className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-navy)]"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add peer company"
          className="min-w-[12rem] flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]"
        >
          Add peer
        </button>
      </div>
      {includedCount > 0 ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {contributingCount} of {includedCount} selected peer
          {includedCount === 1 ? "" : "s"} included in comparison metrics.
        </p>
      ) : (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          No peers selected for comparison.
        </p>
      )}
      {excludedCount > 0 ? (
        <p className="mt-2 text-xs text-[var(--peer-warn-text)]">
          {excludedCount} peer{excludedCount === 1 ? "" : "s"} excluded from
          comparison
          {excludedCount <= 3
            ? `: ${excludedIncluded.map((p) => p.name).join(", ")}`
            : ""}
          . Add a recognized public retailer or remove to refresh peer median.
        </p>
      ) : null}
    </div>
  );
}
