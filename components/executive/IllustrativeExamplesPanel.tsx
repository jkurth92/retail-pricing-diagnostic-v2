"use client";

import { useId, useState } from "react";
import type { IllustrativeCommercialExample } from "@/types/evidence-illustrations";

type IllustrativeExamplesPanelProps = {
  examples: IllustrativeCommercialExample[];
  disclaimer?: string;
};

function parseSkuLine(line: string): { label: string; price: string } {
  const match = line.match(/^(.+?)\s*=\s*(\$.+)$/);
  if (match) {
    return { label: match[1].trim(), price: match[2].trim() };
  }
  return { label: line, price: "" };
}

function SkuCompareBlock({ lines }: { lines: string[] }) {
  return (
    <div
      className={`ent-sku-compare ${lines.length === 2 ? "ent-sku-compare--pair" : ""}`}
      role="list"
    >
      {lines.map((line) => {
        const { label, price } = parseSkuLine(line);
        return (
          <div key={line} className="ent-sku-compare-item" role="listitem">
            <p className="ent-sku-compare-label" title={label}>
              {label}
            </p>
            {price ? <p className="ent-sku-compare-price">{price}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function IllustrativeExamplesPanel({
  examples,
  disclaimer,
}: IllustrativeExamplesPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (examples.length === 0) return null;

  return (
    <div className="ent-illustrations">
      <button
        type="button"
        className="ent-illustrations-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? "Hide detail" : "SKU examples"}</span>
        <span className="ent-illustrations-toggle-icon" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div id={panelId} className="ent-illustrations-body">
          <div
            className={`ent-illustrations-grid ${
              examples.length > 1 ? "ent-illustrations-grid--multi" : ""
            }`}
          >
            {examples.map((ex, i) => (
              <div key={`${ex.category}-${i}`} className="ent-illustration-card">
                <p className="ent-illustration-card-category">{ex.category}</p>

                {ex.skuLines && ex.skuLines.length > 0 ? (
                  <>
                    <p className="ent-illustration-section-label">Example</p>
                    <SkuCompareBlock lines={ex.skuLines} />
                    <p className="ent-illustration-section-label ent-illustration-section-label--interp">
                      Interpretation
                    </p>
                    <p className="ent-illustration-interpretation">{ex.interpretation}</p>
                  </>
                ) : (
                  <>
                    <p className="ent-illustration-observation">{ex.observation}</p>
                    <p className="ent-illustration-interpretation ent-illustration-interpretation--muted">
                      {ex.interpretation}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
          {disclaimer && <p className="ent-illustrations-disclaimer">{disclaimer}</p>}
        </div>
      )}
    </div>
  );
}
