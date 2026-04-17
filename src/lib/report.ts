import { computeAnalysisSnapshot } from "./analysis";
import { DesignState, LegalReviewState } from "./types";

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
const STATUS_LABEL: Record<string, string> = {
  pending: "PENDING",
  approve: "APPROVED",
  "needs-change": "NEEDS CHANGE",
  blocker: "BLOCKER",
};

/**
 * TODO(report-generator): Swap this mock for a richer template (Markdown/PDF)
 * driven by the same DesignState + LegalReviewState contract.
 */
export function generateReport(design: DesignState, legal: LegalReviewState): string {
  const snap = computeAnalysisSnapshot(design);
  const safeguards = Object.entries(design.safeguards)
    .filter(([, v]) => v)
    .map(([k]) => `  - ${k}`)
    .join("\n") || "  - (none)";

  const points = legal.points
    .map(
      p => `[${STATUS_LABEL[p.status]}] ${p.title}
  hint    : ${p.hint}
  ref     : ${p.relatedArticles ?? "-"}
  comment : ${p.comment.trim() || "(no comment)"}`
    )
    .join("\n\n");

  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  return `MiCA DESIGN REVIEW REPORT
=================================================
Generated         : ${date} UTC
Reviewer          : ${legal.reviewer.name || "(unsigned)"}
Reviewer role     : ${legal.reviewer.role}

-- DESIGN SUMMARY --------------------------------
Token role        : ${ROLE_LABEL[design.tokenRole]}
Issuer type       : ${ISSUER_LABEL[design.issuerType]}
Single responsible entity : ${design.singleResponsibleEntity ? "Yes" : "No"}
Expected holders  : ${design.holderScale}
Market cap range  : ${design.marketCapRange}
Redemption        : ${design.redemption}
KYC level         : ${design.kyc}
Safeguards        :
${safeguards}

Use case:
${design.useCase || "(not provided)"}

-- AUTO-ANALYSIS SNAPSHOT ------------------------
Verdict           : ${snap.headline}
Design readiness  : ${snap.readiness} / 100
  Consumer prot.  : ${snap.pillars.consumerProtection}
  Issuer resp.    : ${snap.pillars.issuerResponsibility}
  Transparency    : ${snap.pillars.transparency}
  Governance      : ${snap.pillars.governance}

-- REVIEW POINTS ---------------------------------
${points}

=================================================
End of report.`;
}
