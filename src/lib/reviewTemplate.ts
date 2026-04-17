import { DesignSpec, LegalReview, ReviewPoint } from "./types";
import { DesignScore } from "./scoring";

interface PointDef {
  id: string;
  title: string;
  relatedArticles?: string;
  hint: (design: DesignSpec, score: DesignScore) => string;
}

const POINT_DEFS: PointDef[] = [
  {
    id: "issuer",
    title: "Issuer & responsibility clearly defined",
    relatedArticles: "MiCA Title III, Art. 16–18",
    hint: (d) => {
      if (d.issuerType === "none") {
        return "No clear issuer defined; confirm who is legally responsible toward holders.";
      }
      if (!d.singleResponsibleEntity) {
        return `Issuer is a ${d.issuerType === "eu" ? "EU" : "non-EU"} entity but no single responsible entity is declared — document accountability structure.`;
      }
      return d.issuerType === "eu"
        ? "EU entity identified and single responsible party declared — verify licensing and authorisation status."
        : "Non-EU entity with a responsible party — confirm how claims can be enforced inside the EU.";
    },
  },
  {
    id: "redemption",
    title: "Redemption & claims against issuer",
    relatedArticles: "MiCA Art. 39, 49",
    hint: (d) => {
      if (d.tokenRole === "stablecoin" && d.redemption !== "full") {
        return "Stablecoin without full 1:1 redemption at par value is almost certainly a MiCA blocker.";
      }
      if (d.redemption === "none") {
        return "No redemption mechanism; document the legal nature of holder claims and any secondary-market routes.";
      }
      if (d.redemption === "partial") {
        return "Partial redemption — clarify eligibility, conditions and limits in holder disclosures.";
      }
      return "Full redemption policy — verify reserve segregation and operational readiness to honour claims.";
    },
  },
  {
    id: "scale",
    title: "Holder scale & disclosure obligations",
    relatedArticles: "MiCA Art. 6, 8",
    hint: (d) => {
      if (d.holderScale === ">100k" || d.holderScale === "10-100k") {
        return `Expected ${d.holderScale} holders — heightened whitepaper and ongoing disclosure duties apply.`;
      }
      return `Expected ${d.holderScale} holders — baseline whitepaper and marketing disclosures still required.`;
    },
  },
  {
    id: "governance",
    title: "Governance & admin keys",
    relatedArticles: "MiCA Art. 34",
    hint: (d) => {
      const onchain = d.safeguards.onChainGovernance ? "on-chain governance declared" : "no on-chain governance";
      const pause = d.safeguards.emergencyPause ? "emergency pause present" : "no emergency pause";
      return `Document upgrade keys, multisig holders, emergency procedures — current signals: ${onchain}, ${pause}.`;
    },
  },
  {
    id: "kyc",
    title: "KYC & AML adequacy",
    relatedArticles: "AMLD6, TFR",
    hint: (d) => {
      if (d.kyc === "none") {
        return "No KYC declared — evaluate exposure under AMLD6 and the TFR travel rule.";
      }
      if (d.kyc === "light") {
        return "Light KYC — verify it matches issuer type and the expected holder scale.";
      }
      return "Full KYC declared — confirm onboarding flow covers TFR travel-rule data and sanctions screening.";
    },
  },
  {
    id: "transparency",
    title: "Reporting & transparency",
    relatedArticles: "MiCA Art. 36, 67",
    hint: (d) => {
      const reserves = d.safeguards.transparentReserves ? "reserves disclosed" : "reserves not disclosed";
      const audits = d.safeguards.independentAudits ? "independent audits" : "no independent audits";
      return `Confirm periodic disclosures, reserve attestations and incident reporting — current signals: ${reserves}, ${audits}.`;
    },
  },
];

export function createInitialReview(design: DesignSpec, score: DesignScore): LegalReview {
  const points: ReviewPoint[] = POINT_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    relatedArticles: def.relatedArticles,
    hint: def.hint(design, score),
    status: "pending",
    comment: "",
  }));

  return {
    points,
    reviewer: { name: "", role: "Legal counsel" },
    createdAt: new Date().toISOString(),
    locked: false,
  };
}
