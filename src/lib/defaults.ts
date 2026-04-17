import { DesignState, LegalReviewState, ReviewPoint } from "./types";

export const defaultDesign: DesignState = {
  tokenRole: "utility",
  useCase: "",
  issuerType: "none",
  singleResponsibleEntity: false,
  holderScale: "1-10k",
  marketCapRange: "€1M – €10M",
  redemption: "none",
  kyc: "none",
  safeguards: {
    emergencyPause: false,
    transparentReserves: false,
    onChainGovernance: false,
    independentAudits: false,
  },
};

export const defaultReviewPoints: ReviewPoint[] = [
  {
    id: "issuer",
    title: "Issuer & responsibility clearly defined",
    hint: "Check that a single legal entity bears responsibility toward holders.",
    relatedArticles: "MiCA Title III, Art. 16–18",
    status: "pending",
    comment: "",
  },
  {
    id: "redemption",
    title: "Redemption & claims against issuer",
    hint: "Holders should have an enforceable redemption right at par value.",
    relatedArticles: "MiCA Art. 39, 49",
    status: "pending",
    comment: "",
  },
  {
    id: "scale",
    title: "Holder scale & disclosure obligations",
    hint: "Larger holder bases trigger heightened transparency duties.",
    relatedArticles: "MiCA Art. 6, 8",
    status: "pending",
    comment: "",
  },
  {
    id: "governance",
    title: "Governance / admin keys & upgradability",
    hint: "Document upgrade keys, multisig holders, and emergency procedures.",
    relatedArticles: "MiCA Art. 34",
    status: "pending",
    comment: "",
  },
  {
    id: "kyc",
    title: "KYC / AML adequacy",
    hint: "Map onboarding flows to AMLD6 / TFR travel rule expectations.",
    relatedArticles: "AMLD6, TFR",
    status: "pending",
    comment: "",
  },
  {
    id: "transparency",
    title: "Reporting & transparency",
    hint: "Periodic disclosures, reserve attestations, and incident reporting.",
    relatedArticles: "MiCA Art. 36, 67",
    status: "pending",
    comment: "",
  },
  {
    id: "whitepaper",
    title: "Whitepaper & marketing communications",
    hint: "Required disclosures, fairness, no misleading claims.",
    relatedArticles: "MiCA Art. 6–7",
    status: "pending",
    comment: "",
  },
];

export const defaultLegalReview: LegalReviewState = {
  points: defaultReviewPoints,
  reviewer: { name: "", role: "Legal counsel" },
  createdAt: "",
  locked: false,
};

export const presets: Record<string, { label: string; design: import("./types").DesignState }> = {
  degen: {
    label: "DeFi degen token",
    design: {
      tokenRole: "utility",
      useCase: "Permissionless rewards token for a yield protocol. No issuer, anonymous core team.",
      issuerType: "none",
      singleResponsibleEntity: false,
      holderScale: "10-100k",
      marketCapRange: "€10M – €100M",
      redemption: "none",
      kyc: "none",
      safeguards: {
        emergencyPause: false,
        transparentReserves: false,
        onChainGovernance: true,
        independentAudits: false,
      },
    },
  },
  stablecoin: {
    label: "Aspiring compliant stablecoin",
    design: {
      tokenRole: "stablecoin",
      useCase: "Euro-pegged e-money token issued by an EU entity, fully reserved 1:1 in segregated accounts.",
      issuerType: "eu",
      singleResponsibleEntity: true,
      holderScale: ">100k",
      marketCapRange: "€100M – €1B",
      redemption: "full",
      kyc: "full",
      safeguards: {
        emergencyPause: true,
        transparentReserves: true,
        onChainGovernance: false,
        independentAudits: true,
      },
    },
  },
  governance: {
    label: "Governance-only token",
    design: {
      tokenRole: "governance",
      useCase: "Pure governance token with no economic claim, used solely to vote on protocol parameters.",
      issuerType: "non-eu",
      singleResponsibleEntity: false,
      holderScale: "1-10k",
      marketCapRange: "<€1M",
      redemption: "none",
      kyc: "light",
      safeguards: {
        emergencyPause: false,
        transparentReserves: false,
        onChainGovernance: true,
        independentAudits: true,
      },
    },
  },
};
