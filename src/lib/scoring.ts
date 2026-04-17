import { DesignSpec } from "./types";

export interface CategoryScore {
  label: "weak" | "ok" | "strong";
  score: number; // 0–100
  explanation: string;
}

export interface DesignScore {
  globalScore: number; // 0–100
  status: "high_risk" | "medium_risk" | "near_ready";
  statusLabel: string;
  categories: {
    consumerProtection: CategoryScore;
    issuerResponsibility: CategoryScore;
    transparency: CategoryScore;
    governance: CategoryScore;
  };
  keyRisks: string[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function labelFor(score: number): CategoryScore["label"] {
  if (score >= 70) return "strong";
  if (score >= 40) return "ok";
  return "weak";
}

const HOLDER_WEIGHT: Record<DesignSpec["holderScale"], number> = {
  "<1k": 0,
  "1-10k": 1,
  "10-100k": 2,
  ">100k": 3,
};

export function evaluateDesign(design: DesignSpec): DesignScore {
  const scaleIdx = HOLDER_WEIGHT[design.holderScale];

  // ---- Global score ----
  let global = 50;

  if (design.issuerType === "eu") global += 20;
  else if (design.issuerType === "none") global -= 25;

  global += design.singleResponsibleEntity ? 10 : -10;

  if (design.redemption === "none") global -= 25;
  else if (design.redemption === "partial") global -= 10;
  else global += 15; // full

  if (design.kyc === "none") global -= 20;
  else if (design.kyc === "light") global -= 5;
  else global += 15; // full

  if (design.safeguards.emergencyPause) global += 5;
  if (design.safeguards.transparentReserves) global += 10;
  if (design.safeguards.onChainGovernance) global += 5;
  if (design.safeguards.independentAudits) global += 5;

  // Large holder scale with weak protections is penalised.
  if (scaleIdx >= 2 && design.kyc === "none") global -= 10;
  if (scaleIdx >= 3 && !design.safeguards.transparentReserves) global -= 5;
  if (design.tokenRole === "stablecoin" && design.redemption !== "full") global -= 15;

  const globalScore = clamp(global);

  let status: DesignScore["status"];
  let statusLabel: string;
  if (globalScore <= 35) {
    status = "high_risk";
    statusLabel = "Likely high regulatory risk";
  } else if (globalScore <= 70) {
    status = "medium_risk";
    statusLabel = "Partially aligned with MiCA expectations";
  } else {
    status = "near_ready";
    statusLabel = "Closer to MiCA-ready architecture";
  }

  // ---- Consumer protection ----
  let consumer = 20;
  if (design.redemption === "full") consumer += 45;
  else if (design.redemption === "partial") consumer += 20;
  if (design.kyc === "full") consumer += 20;
  else if (design.kyc === "light") consumer += 10;
  if (design.tokenRole === "stablecoin" && design.redemption !== "full") consumer -= 25;
  if (scaleIdx >= 2 && design.kyc === "none") consumer -= 10;
  const consumerScore = clamp(consumer);

  // ---- Issuer responsibility ----
  let issuer = 20;
  if (design.issuerType === "eu") issuer += 45;
  else if (design.issuerType === "non-eu") issuer += 20;
  if (design.singleResponsibleEntity) issuer += 15;
  if (design.issuerType === "none") issuer -= 10;
  const issuerScore = clamp(issuer);

  // ---- Transparency ----
  let transparency = 20;
  if (design.safeguards.transparentReserves) transparency += 30;
  if (design.safeguards.independentAudits) transparency += 25;
  if (design.safeguards.emergencyPause) transparency += 10;
  if (scaleIdx >= 2 && !design.safeguards.transparentReserves) transparency -= 5;
  const transparencyScore = clamp(transparency);

  // ---- Governance & control ----
  let governance = 30;
  if (design.safeguards.onChainGovernance) governance += 25;
  if (design.safeguards.emergencyPause) governance += 15;
  if (design.singleResponsibleEntity) governance += 10;
  const governanceScore = clamp(governance);

  // ---- Key risks ----
  const keyRisks: string[] = [];
  if (design.issuerType === "none") {
    keyRisks.push("No clear issuer defined; confirm who is legally responsible toward holders.");
  }
  if (!design.singleResponsibleEntity) {
    keyRisks.push("No single responsible entity — accountability may be unclear to regulators.");
  }
  if (design.tokenRole === "stablecoin" && design.redemption !== "full") {
    keyRisks.push("Stablecoin without full 1:1 redemption is almost certainly a MiCA blocker.");
  } else if (design.redemption === "none") {
    keyRisks.push("No redemption mechanism — document the legal nature of holder claims.");
  }
  if (design.kyc === "none" && scaleIdx >= 2) {
    keyRisks.push("Large holder base with no KYC raises AML/CTF and distribution concerns.");
  }
  if (design.tokenRole === "stablecoin" && !design.safeguards.transparentReserves) {
    keyRisks.push("Stablecoin reserves are not transparent — will fail MiCA reserve disclosure expectations.");
  }
  if (scaleIdx >= 2 && !design.safeguards.independentAudits) {
    keyRisks.push("Significant holder base without independent audits limits trust and enforceability.");
  }

  return {
    globalScore,
    status,
    statusLabel,
    categories: {
      consumerProtection: {
        label: labelFor(consumerScore),
        score: consumerScore,
        explanation: `Redemption: ${design.redemption}, KYC: ${design.kyc}.`,
      },
      issuerResponsibility: {
        label: labelFor(issuerScore),
        score: issuerScore,
        explanation: `Issuer: ${design.issuerType}, single responsible entity: ${design.singleResponsibleEntity ? "yes" : "no"}.`,
      },
      transparency: {
        label: labelFor(transparencyScore),
        score: transparencyScore,
        explanation: `Reserves: ${design.safeguards.transparentReserves ? "disclosed" : "not disclosed"}, audits: ${design.safeguards.independentAudits ? "independent" : "none"}.`,
      },
      governance: {
        label: labelFor(governanceScore),
        score: governanceScore,
        explanation: `On-chain governance: ${design.safeguards.onChainGovernance ? "yes" : "no"}, emergency pause: ${design.safeguards.emergencyPause ? "yes" : "no"}.`,
      },
    },
    keyRisks,
  };
}
