"use client";

import { useMemo } from "react";
import { inferUploadFindings } from "@/lib/inferUploadFindings";

type WhatWeFoundPanelProps = {
  retailerName: string;
  uploadedFileCount: number;
};

export function WhatWeFoundPanel({
  retailerName,
  uploadedFileCount,
}: WhatWeFoundPanelProps) {
  const findings = useMemo(
    () => inferUploadFindings(uploadedFileCount),
    [uploadedFileCount],
  );

  return (
    <section className="what-we-found" aria-labelledby="what-we-found-heading">
      <p className="what-we-found-eyebrow">File review</p>
      <h2 id="what-we-found-heading" className="what-we-found-title">
        What we found
      </h2>
      <p className="what-we-found-lead">
        {uploadedFileCount > 0
          ? `Structural signals from your upload${retailerName ? ` for ${retailerName}` : ""}.`
          : `Baseline read for${retailerName ? ` ${retailerName}` : " this retailer"} — upload files to sharpen detection.`}
      </p>

      <div className="what-we-found-grid">
        <div className="what-we-found-block">
          <h3 className="what-we-found-block-title">Detected</h3>
          <ul className="what-we-found-list">
            {findings.detected.map((item) => (
              <li key={item}>
                <span className="what-we-found-check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="what-we-found-block what-we-found-block-accent">
          <h3 className="what-we-found-block-title">Diagnostics likely available</h3>
          <ul className="what-we-found-tags">
            {findings.diagnosticsAvailable.map((item) => (
              <li key={item} className="what-we-found-tag">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
