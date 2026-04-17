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

/** Canonical alias — `DesignState` is our normalized DesignSpec. */
export type DesignSpec = DesignState;

export type ReviewStatus = "pending" | "approve" | "needs-change" | "blocker";

export interface ReviewPoint {
  id: string;
  title: string;
  hint: string;
  relatedArticles?: string;
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
  createdAt: string;
  locked: boolean;
}

/** Canonical alias — `LegalReviewState` is our LegalReview. */
export type LegalReview = LegalReviewState;
