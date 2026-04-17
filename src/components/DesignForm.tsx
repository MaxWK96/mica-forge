import { useStore } from "@/lib/store";
import { presets } from "@/lib/defaults";
import { ChipGroup, Field, Section, Toggle } from "./ui-bits";
import {
  DataArchitecture,
  DataController,
  HolderScale,
  IssuerType,
  KycLevel,
  Redemption,
  TokenRole,
} from "@/lib/types";

export function DesignForm() {
  const { design, setDesign, applyDesign, flashTick } = useStore();

  return (
    <div className="space-y-5">
      <Section eyebrow="01 / Token basics" title="Token basics">
        <Field label="Token role">
          <ChipGroup<TokenRole>
            value={design.tokenRole}
            onChange={v => setDesign(d => ({ ...d, tokenRole: v }))}
            options={[
              { value: "utility", label: "Utility token" },
              { value: "stablecoin", label: "Stablecoin (EMT/ART)" },
              { value: "governance", label: "Governance token" },
            ]}
          />
        </Field>
        <Field label="Use case" hint="1–3 sentences">
          <textarea
            value={design.useCase}
            onChange={e => setDesign(d => ({ ...d, useCase: e.target.value }))}
            rows={3}
            placeholder="What does this token do, who uses it, and why does it need to exist?"
            className="w-full rounded-sm bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </Field>
      </Section>

      <Section eyebrow="02 / Issuer" title="Issuer & structure">
        <Field label="Issuer type">
          <ChipGroup<IssuerType>
            value={design.issuerType}
            onChange={v => setDesign(d => ({ ...d, issuerType: v }))}
            options={[
              { value: "eu", label: "EU entity" },
              { value: "non-eu", label: "Non-EU entity" },
              { value: "none", label: "No clear issuer" },
            ]}
          />
        </Field>
        <Field label="Single responsible entity">
          <ChipGroup<"yes" | "no">
            value={design.singleResponsibleEntity ? "yes" : "no"}
            onChange={v => setDesign(d => ({ ...d, singleResponsibleEntity: v === "yes" }))}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </Field>
      </Section>

      <Section eyebrow="03 / Holders" title="Holders & scale">
        <Field label="Expected holder count">
          <ChipGroup<HolderScale>
            value={design.holderScale}
            onChange={v => setDesign(d => ({ ...d, holderScale: v }))}
            options={[
              { value: "<1k", label: "<1k" },
              { value: "1-10k", label: "1–10k" },
              { value: "10-100k", label: "10–100k" },
              { value: ">100k", label: ">100k" },
            ]}
          />
        </Field>
        <Field label="Expected total value / market cap">
          <select
            value={design.marketCapRange}
            onChange={e => setDesign(d => ({ ...d, marketCapRange: e.target.value }))}
            className="w-full rounded-sm bg-input border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {["<€1M", "€1M – €10M", "€10M – €100M", "€100M – €1B", ">€1B"].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </Section>

      <Section eyebrow="04 / Protections" title="Rights & protections">
        <Field label="Redemption">
          <ChipGroup<Redemption>
            value={design.redemption}
            onChange={v => setDesign(d => ({ ...d, redemption: v }))}
            options={[
              { value: "none", label: "None" },
              { value: "partial", label: "Partial" },
              { value: "full", label: "Full 1:1" },
            ]}
          />
        </Field>
        <Field label="KYC level">
          <ChipGroup<KycLevel>
            value={design.kyc}
            onChange={v => setDesign(d => ({ ...d, kyc: v }))}
            options={[
              { value: "none", label: "None" },
              { value: "light", label: "Light" },
              { value: "full", label: "Full" },
            ]}
          />
        </Field>
        <Field label="Safeguards">
          <div className="grid sm:grid-cols-2 gap-2">
            <Toggle
              label="Emergency pause"
              checked={design.safeguards.emergencyPause}
              onChange={v => setDesign(d => ({ ...d, safeguards: { ...d.safeguards, emergencyPause: v } }))}
            />
            <Toggle
              label="Transparent reserves"
              checked={design.safeguards.transparentReserves}
              onChange={v => setDesign(d => ({ ...d, safeguards: { ...d.safeguards, transparentReserves: v } }))}
            />
            <Toggle
              label="On-chain governance"
              checked={design.safeguards.onChainGovernance}
              onChange={v => setDesign(d => ({ ...d, safeguards: { ...d.safeguards, onChainGovernance: v } }))}
            />
            <Toggle
              label="Independent audits"
              checked={design.safeguards.independentAudits}
              onChange={v => setDesign(d => ({ ...d, safeguards: { ...d.safeguards, independentAudits: v } }))}
            />
          </div>
        </Field>
      </Section>

      <Section eyebrow="05 / Data & control" title="Data & control">
        <Field label="Data architecture">
          <ChipGroup<DataArchitecture>
            value={design.dataArchitecture}
            onChange={v => setDesign(d => ({ ...d, dataArchitecture: v }))}
            options={[
              { value: "onchain-only", label: "On-chain only" },
              { value: "hybrid", label: "Hybrid (off-chain data + on-chain state)" },
              { value: "offchain-platform", label: "Off-chain platform with on-chain token" },
            ]}
          />
        </Field>
        <Field label="Who controls user data?">
          <ChipGroup<DataController>
            value={design.dataController}
            onChange={v => setDesign(d => ({ ...d, dataController: v }))}
            options={[
              { value: "issuer", label: "Issuer" },
              { value: "third-party", label: "Third-party processor" },
              { value: "decentralized", label: "Decentralized protocol" },
            ]}
          />
        </Field>
      </Section>

      <Section eyebrow="06 / Presets" title="Design presets">
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyDesign(p.design)}
              className="px-4 py-2.5 rounded-sm border border-border bg-surface-2 hover:border-primary/60 hover:bg-primary/5 text-sm font-medium transition-all flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              {p.label}
            </button>
          ))}
        </div>
        <p key={flashTick} className="text-[11px] text-muted-foreground font-mono-ui">
          Picking a preset overwrites all fields above.
        </p>
      </Section>
    </div>
  );
}
