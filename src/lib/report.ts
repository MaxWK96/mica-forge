import { DesignSpec, LegalReview } from "./types";
import { DesignScore, evaluateDesign } from "./scoring";

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

function formatDate(iso: string): string {
  if (!iso) return new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";
  return iso.slice(0, 19).replace("T", " ") + " UTC";
}

export function generateTextReport(
  design: DesignSpec,
  score: DesignScore,
  review: LegalReview
): string {
  const safeguards = Object.entries(design.safeguards)
    .filter(([, v]) => v)
    .map(([k]) => `  - ${k}`)
    .join("\n") || "  - (none)";

  const risks = score.keyRisks.length
    ? score.keyRisks.map(r => `  - ${r}`).join("\n")
    : "  - (no material risks flagged)";

  const points = review.points
    .map(
      p => `[${STATUS_LABEL[p.status] ?? p.status.toUpperCase()}] ${p.title}
  hint    : ${p.hint}
  ref     : ${p.relatedArticles ?? "-"}
  comment : ${p.comment.trim() || "(no comment)"}`
    )
    .join("\n\n");

  const generated = new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

  return `# MiCA Design Review Report

Generated         : ${generated}
Review created    : ${formatDate(review.createdAt)}
Reviewer          : ${review.reviewer.name || "(unsigned)"}
Reviewer role     : ${review.reviewer.role || "(unspecified)"}

## Design summary
Token role        : ${ROLE_LABEL[design.tokenRole] ?? design.tokenRole}
Issuer type       : ${ISSUER_LABEL[design.issuerType] ?? design.issuerType}
Single responsible entity : ${design.singleResponsibleEntity ? "Yes" : "No"}
Expected holders  : ${design.holderScale}
Market cap range  : ${design.marketCapRange}
Redemption        : ${design.redemption}
KYC level         : ${design.kyc}
Safeguards        :
${safeguards}

Use case:
${design.useCase || "(not provided)"}

## Automatic analysis
Verdict           : ${score.statusLabel}
Design readiness  : ${score.globalScore} / 100
  Consumer prot.  : ${score.categories.consumerProtection.score} (${score.categories.consumerProtection.label})
  Issuer resp.    : ${score.categories.issuerResponsibility.score} (${score.categories.issuerResponsibility.label})
  Transparency    : ${score.categories.transparency.score} (${score.categories.transparency.label})
  Governance      : ${score.categories.governance.score} (${score.categories.governance.label})

Key risks:
${risks}

## Legal review
${points}

---
End of report.`;
}

/** Backward-compatible wrapper used by callers that only have design + review. */
export function generateReport(design: DesignSpec, review: LegalReview): string {
  return generateTextReport(design, evaluateDesign(design), review);
}
