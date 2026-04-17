// Shared types for MiCA Design Review Room

export type TokenRole = "utility" | "stablecoin" | "governance";
export type IssuerType = "eu" | "non-eu" | "none";
export type HolderScale = "<1k" | "1-10k" | "10-100k" | ">100k";
export type Redemption = "none" | "partial" | "full";
export type KycLevel = "none" | "light" | "full";

export interface Safeguards {
  emergencyPause: boolean;
  transparentReserves: boolean;
  onChainGovernance: boolean;
  independentAudits: boolean;
}

export interface DesignState {
  tokenRole: TokenRole;
  useCase: string;
  issuerType: IssuerType;
  singleResponsibleEntity: boolean;
  holderScale: HolderScale;
  marketCapRange: string;
  redemption: Redemption;
  kyc: KycLevel;
  safeguards: Safeguards;
}

export type ReviewStatus = "pending" | "approve" | "needs-change" | "blocker";

export interface ReviewPoint {
  id: string;
  title: string;
  hint: string; // TODO: replace with logic-driven hint generator
  relatedArticles?: string; // static label for now
  status: ReviewStatus;
  comment: string;
}

export interface ReviewerMeta {
  name: string;
  role: string;
}

export interface LegalReviewState {
  points: ReviewPoint[];
  reviewer: ReviewerMeta;
}

export type AnalysisVerdict =
  | "high-risk"
  | "partial"
  | "ready";

export interface AnalysisSnapshotResult {
  verdict: AnalysisVerdict;
  headline: string;
  readiness: number; // 0..100
  pillars: {
    consumerProtection: number;
    issuerResponsibility: number;
    transparency: number;
    governance: number;
  };
}
