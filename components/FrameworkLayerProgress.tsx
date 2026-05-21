import { FRAMEWORK_LAYER_LABELS } from "@/data/presentationPlaceholders";

export function FrameworkLayerProgress() {
  return (
    <div className="card-surface p-5">
      <p className="micro-label mb-3">Engine readiness (illustrative)</p>
      <ol className="space-y-2">
        {FRAMEWORK_LAYER_LABELS.map((layer) => (
          <li
            key={layer.step}
            className="flex items-center justify-between gap-4 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5"
          >
            <span className="text-sm text-[var(--text-navy)]">
              <span className="mr-2 font-mono text-xs text-[var(--text-muted)]">
                {layer.step}
              </span>
              {layer.name}
            </span>
            <span className="shrink-0 text-xs font-medium text-[var(--accent)]">
              {layer.status}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
