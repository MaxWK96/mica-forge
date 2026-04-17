import { AnalysisSnapshotResult, DesignState } from "./types";

/**
 * TODO(scoring-engine): Replace this mock with a real rule-based / LLM-driven
 * scoring engine. The shape of AnalysisSnapshotResult is the integration contract
 * — keep it stable so the UI doesn't need to change.
 */
export function computeAnalysisSnapshot(d: DesignState): AnalysisSnapshotResult {
  let consumer = 20;
  let issuer = 20;
  let transparency = 20;
  let governance = 30;

  if (d.issuerType === "eu") issuer += 45;
  else if (d.issuerType === "non-eu") issuer += 20;
  if (d.singleResponsibleEntity) issuer += 15;

  if (d.redemption === "full") consumer += 45;
  else if (d.redemption === "partial") consumer += 20;
  if (d.kyc === "full") consumer += 20;
  else if (d.kyc === "light") consumer += 10;

  if (d.safeguards.transparentReserves) transparency += 30;
  if (d.safeguards.independentAudits) transparency += 25;
  if (d.safeguards.emergencyPause) transparency += 10;

  if (d.safeguards.onChainGovernance) governance += 25;
  if (d.safeguards.emergencyPause) governance += 15;
  if (d.singleResponsibleEntity) governance += 10;

  // Stablecoins are held to a higher bar
  if (d.tokenRole === "stablecoin" && d.redemption !== "full") {
    consumer -= 25;
    issuer -= 10;
  }

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const pillars = {
    consumerProtection: clamp(consumer),
    issuerResponsibility: clamp(issuer),
    transparency: clamp(transparency),
    governance: clamp(governance),
  };
  const readiness = Math.round(
    (pillars.consumerProtection + pillars.issuerResponsibility + pillars.transparency + pillars.governance) / 4
  );

  let verdict: AnalysisSnapshotResult["verdict"];
  let headline: string;
  if (readiness < 40) {
    verdict = "high-risk";
    headline = "Likely high regulatory risk";
  } else if (readiness < 70) {
    verdict = "partial";
    headline = "Partially aligned with MiCA expectations";
  } else {
    verdict = "ready";
    headline = "Closer to MiCA-ready architecture";
  }

  return { verdict, headline, readiness, pillars };
}
