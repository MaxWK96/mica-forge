import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { computeAnalysisSnapshot } from "@/lib/analysis";
import { generateReport } from "@/lib/report";
import { ReviewStatus } from "@/lib/types";

const ROLE_LABEL: Record<string, string> = {
  utility: "Utility token",
  stablecoin: "Stablecoin (EMT/ART)",
  governance: "Governance token",
};
const ISSUER_LABEL: Record<string, string> = {
  eu: "EU entity",
  "non-eu": "Non-EU entity",
  none: "No clear issuer",
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-border/60 last:border-0">
      <span className="label-eyebrow">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function StatusButton({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: "success" | "warning" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? active ? "bg-success text-success-foreground border-success" : "border-border hover:border-success/60 hover:text-success"
      : tone === "warning"
      ? active ? "bg-warning text-warning-foreground border-warning" : "border-border hover:border-warning/60 hover:text-warning"
      : active ? "bg-destructive text-destructive-foreground border-destructive" : "border-border hover:border-destructive/60 hover:text-destructive";
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-sm border text-xs font-mono-ui uppercase tracking-wider transition-all",
        toneClass,
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ReportModal({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="panel w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <div className="label-eyebrow">Locked review</div>
            <h3 className="font-display text-lg font-semibold mt-1">Design Review Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="px-3 py-1.5 rounded-sm border border-border text-xs font-mono-ui uppercase tracking-wider hover:border-primary/60 hover:text-primary"
            >
              Copy
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-sm bg-surface-2 border border-border text-xs font-mono-ui uppercase tracking-wider hover:border-foreground/40"
            >
              Close
            </button>
          </div>
        </div>
        <pre className="p-5 overflow-auto text-[12px] leading-relaxed font-mono whitespace-pre-wrap text-foreground/90">
{text}
        </pre>
      </div>
    </div>
  );
}

export function LegalReviewView() {
  const { design, legal, setReviewStatus, setReviewComment, setReviewer } = useStore();
  const snap = useMemo(() => computeAnalysisSnapshot(design), [design]);
  const [report, setReport] = useState<string | null>(null);

  const safeguardsList = Object.entries(design.safeguards)
    .filter(([, v]) => v)
    .map(([k]) => k.replace(/([A-Z])/g, " $1").toLowerCase())
    .join(", ") || "(none)";

  const counts = legal.points.reduce(
    (acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }),
    {} as Record<ReviewStatus, number>
  );

  return (
    <div className="container py-6 sm:py-8 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-1">Workspace · Legal review</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Review &amp; sign off
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate each critical risk point. Approve, flag, or block.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono-ui">
          <span className="px-2 py-1 rounded-sm bg-success/10 text-success border border-success/30">
            ✓ {counts.approve ?? 0}
          </span>
          <span className="px-2 py-1 rounded-sm bg-warning/10 text-warning border border-warning/30">
            ⚠ {counts["needs-change"] ?? 0}
          </span>
          <span className="px-2 py-1 rounded-sm bg-destructive/10 text-destructive border border-destructive/30">
            ✕ {counts.blocker ?? 0}
          </span>
        </div>
      </div>

      {/* TOP PANEL — design summary as spec sheet */}
      <section className="panel p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-amber opacity-60" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="label-eyebrow mb-2">Design summary · v1</div>
            <h3 className="font-display text-xl font-semibold mb-4">
              {ROLE_LABEL[design.tokenRole]} · {ISSUER_LABEL[design.issuerType]}
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic border-l-2 border-primary/60 pl-4">
              {design.useCase || "No use case provided."}
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <SpecRow label="Token role" value={ROLE_LABEL[design.tokenRole]} />
              <SpecRow label="Issuer type" value={ISSUER_LABEL[design.issuerType]} />
              <SpecRow label="Single resp. entity" value={design.singleResponsibleEntity ? "Yes" : "No"} />
              <SpecRow label="Holder scale" value={design.holderScale} />
              <SpecRow label="Market cap" value={design.marketCapRange} />
              <SpecRow label="Redemption" value={design.redemption} />
              <SpecRow label="KYC" value={design.kyc} />
              <SpecRow label="Safeguards" value={safeguardsList} />
            </div>
          </div>
          <div className="border-l-0 lg:border-l border-border lg:pl-6">
            <div className="label-eyebrow mb-2">Auto-analysis</div>
            <div className="text-3xl font-display font-semibold neon-text">
              {snap.readiness}
              <span className="text-sm text-muted-foreground font-mono-ui"> / 100</span>
            </div>
            <p className="text-sm mt-1">{snap.headline}</p>
            <div className="h-1.5 mt-4 rounded-full bg-surface-3 overflow-hidden">
              <div className="h-full bg-gradient-amber" style={{ width: `${snap.readiness}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM PANEL — checklist */}
      <section className="panel p-5 sm:p-6">
        <header className="mb-5">
          <div className="label-eyebrow mb-1">Review checklist</div>
          <h3 className="font-display text-lg font-semibold">Critical review points</h3>
        </header>

        <div className="divide-y divide-border">
          {legal.points.map((p, i) => (
            <div key={p.id} className="py-5 first:pt-0 last:pb-0 grid lg:grid-cols-[auto_1fr_auto] gap-4">
              <div className="font-mono-ui text-xs text-muted-foreground lg:w-10">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-[15px]">{p.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{p.hint}</p>
                  {p.relatedArticles && (
                    <span className="inline-block mt-2 text-[10px] font-mono-ui text-secondary uppercase tracking-wider px-2 py-0.5 rounded-sm bg-secondary/10 border border-secondary/30">
                      ↗ {p.relatedArticles}
                    </span>
                  )}
                </div>
                <textarea
                  value={p.comment}
                  onChange={e => setReviewComment(p.id, e.target.value)}
                  rows={2}
                  placeholder="Reviewer comment…"
                  className="w-full rounded-sm bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <div className="flex lg:flex-col gap-2 lg:items-stretch lg:w-44">
                <StatusButton
                  active={p.status === "approve"}
                  onClick={() => setReviewStatus(p.id, "approve")}
                  label="Approve"
                  tone="success"
                />
                <StatusButton
                  active={p.status === "needs-change"}
                  onClick={() => setReviewStatus(p.id, "needs-change")}
                  label="Needs change"
                  tone="warning"
                />
                <StatusButton
                  active={p.status === "blocker"}
                  onClick={() => setReviewStatus(p.id, "blocker")}
                  label="Blocker"
                  tone="destructive"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviewer meta + lock */}
      <section className="panel p-5 sm:p-6">
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <label className="label-eyebrow">Reviewer name</label>
            <input
              value={legal.reviewer.name}
              onChange={e => setReviewer({ name: e.target.value })}
              placeholder="Jane Counsel"
              className="w-full rounded-sm bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="label-eyebrow">Role</label>
            <select
              value={legal.reviewer.role}
              onChange={e => setReviewer({ role: e.target.value })}
              className="w-full rounded-sm bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {["Legal counsel", "Compliance officer", "External advisor", "In-house lawyer", "Regulatory liaison"].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setReport(generateReport(design, legal))}
            className="px-5 py-2.5 rounded-sm bg-gradient-amber text-primary-foreground font-semibold text-sm shadow-glow hover:brightness-110 transition-all uppercase tracking-wider font-mono-ui whitespace-nowrap"
          >
            🔒 Lock &amp; generate report
          </button>
        </div>
      </section>

      {report && <ReportModal text={report} onClose={() => setReport(null)} />}
    </div>
  );
}
