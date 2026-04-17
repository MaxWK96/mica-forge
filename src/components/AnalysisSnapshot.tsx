import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { computeAnalysisSnapshot } from "@/lib/analysis";

const VERDICT_STYLE: Record<string, { dot: string; ring: string; text: string }> = {
  "high-risk": {
    dot: "bg-destructive",
    ring: "from-destructive/40 to-destructive/0",
    text: "text-destructive",
  },
  partial: {
    dot: "bg-warning",
    ring: "from-warning/40 to-warning/0",
    text: "text-warning",
  },
  ready: {
    dot: "bg-success",
    ring: "from-success/40 to-success/0",
    text: "text-success",
  },
};

function PillarRow({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 rounded-sm bg-surface-3 grid place-items-center text-primary text-xs font-mono-ui">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-foreground/90 truncate">{label}</span>
          <span className="text-[11px] font-mono-ui text-muted-foreground">{value}</span>
        </div>
        <div className="h-1 mt-1 rounded-full bg-surface-3 overflow-hidden">
          <div
            className="h-full bg-gradient-amber transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AnalysisSnapshot() {
  const { design, flashTick } = useStore();
  // TODO(scoring-engine): when real engine arrives, swap this call.
  const snap = useMemo(() => computeAnalysisSnapshot(design), [design]);
  const style = VERDICT_STYLE[snap.verdict];

  return (
    <aside
      key={flashTick}
      className="panel relative overflow-hidden p-5 sm:p-6 animate-fade-in"
    >
      <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl bg-gradient-to-br ${style.ring} pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="label-eyebrow flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`} />
            Auto-analysis snapshot
          </div>
          <span className="text-[10px] font-mono-ui text-muted-foreground">PREVIEW</span>
        </div>

        <h3 className={`mt-3 font-display text-2xl sm:text-[26px] font-semibold leading-tight ${style.text}`}>
          {snap.headline}
        </h3>

        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="label-eyebrow">Design readiness</span>
            <span className="font-mono-ui text-sm">
              <span className="text-foreground font-semibold">{snap.readiness}</span>
              <span className="text-muted-foreground"> / 100</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
            <div
              className="h-full bg-gradient-amber shadow-glow transition-all duration-700"
              style={{ width: `${snap.readiness}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <PillarRow label="Consumer protection" value={snap.pillars.consumerProtection} icon="CP" />
          <PillarRow label="Issuer responsibility" value={snap.pillars.issuerResponsibility} icon="IR" />
          <PillarRow label="Transparency" value={snap.pillars.transparency} icon="TR" />
          <PillarRow label="Governance & control" value={snap.pillars.governance} icon="GV" />
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground border-t border-border pt-4">
          Indicative only. Final assessment is produced after a legal reviewer locks the report.
        </p>
      </div>
    </aside>
  );
}
