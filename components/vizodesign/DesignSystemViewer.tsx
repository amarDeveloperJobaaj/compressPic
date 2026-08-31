import { cn } from "@/lib/utils";
import type { DesignSystemData } from "@/lib/vizodesign/types";

interface DesignSystemViewerProps {
  designSystem: DesignSystemData;
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  const isGradient = value.includes("gradient");
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "h-10 w-10 shrink-0 rounded-lg border border-border shadow-sm",
          isGradient ? "" : ""
        )}
        style={{ background: value }}
      />
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-primary">{label}</p>
        <p className="truncate font-mono text-[11px] text-text-muted">{value}</p>
      </div>
    </div>
  );
}

function TokenSection({ title, tokens }: { title: string; tokens: Record<string, string> }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
        {title}
      </h4>
      <div className="space-y-2">
        {Object.entries(tokens).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs font-medium text-text-primary">{key}</span>
            <span className="font-mono text-[11px] text-text-muted">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesignSystemViewer({ designSystem }: DesignSystemViewerProps) {
  const { colors, typography, spacing, borderRadius, shadows, gradients } = designSystem;

  return (
    <div className="space-y-8">
      {colors && (
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            Colors
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(colors).map(([key, value]) =>
              value ? (
                <ColorSwatch key={key} label={key} value={value} />
              ) : null
            )}
          </div>
        </div>
      )}

      {typography && (
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            Typography
          </h4>
          <div className="space-y-2">
            {Object.entries(typography).map(([key, value]) =>
              value ? (
                <div key={key} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                  <span className="text-xs font-medium text-text-primary">{key}</span>
                  <span className="font-mono text-[11px] text-text-muted">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {spacing && <TokenSection title="Spacing" tokens={spacing} />}
      {borderRadius && <TokenSection title="Border Radius" tokens={borderRadius} />}
      {shadows && <TokenSection title="Shadows" tokens={shadows} />}

      {gradients && gradients.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            Gradients
          </h4>
          <div className="space-y-2">
            {gradients.map((grad, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 w-full" style={{ background: grad }} />
                <div className="bg-background px-3 py-2">
                  <p className="font-mono text-[11px] text-text-muted break-all">{grad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
