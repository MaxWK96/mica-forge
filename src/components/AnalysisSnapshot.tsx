import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { evaluateDesign, DesignScore } from "@/lib/scoring";

const STATUS_STYLE: Record<DesignScore["status"], { dot: string; ring: string; text: string }> = {
  high_risk: {
    dot: "bg-destructive",
    ring: "from-destructive/40 to-destructive/0",
    text: "text-destructive",
  },
  medium_risk: {
    dot: "bg-warning",
    ring: "from-warning/40 to-warning/0",
    text: "text-warning",
  },
  near_ready: {
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
  const score = useMemo(() => evaluateDesign(design), [design]);
  const style = STATUS_STYLE[score.status];
  const topRisks = score.keyRisks.slice(0, 3);

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
          {score.statusLabel}
        </h3>

        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="label-eyebrow">Design readiness</span>
            <span className="font-mono-ui text-sm">
              <span className="text-foreground font-semibold">{score.globalScore}</span>
              <span className="text-muted-foreground"> / 100</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
            <div
              className="h-full bg-gradient-amber shadow-glow transition-all duration-700"
              style={{ width: `${score.globalScore}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <PillarRow label="Consumer protection" value={score.categories.consumerProtection.score} icon="CP" />
          <PillarRow label="Issuer responsibility" value={score.categories.issuerResponsibility.score} icon="IR" />
          <PillarRow label="Transparency" value={score.categories.transparency.score} icon="TR" />
          <PillarRow label="Governance & control" value={score.categories.governance.score} icon="GV" />
        </div>

        {topRisks.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="label-eyebrow">Key risks</div>
            <ul className="space-y-1.5">
              {topRisks.map((risk, i) => (
                <li key={i} className="text-xs text-foreground/80 leading-snug flex gap-2">
                  <span className={`mt-1 h-1 w-1 flex-none rounded-full ${style.dot}`} />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-[11px] text-muted-foreground border-t border-border pt-4">
          Indicative only. Final assessment is produced after a legal reviewer locks the report.
        </p>
      </div>
    </aside>
  );
}
