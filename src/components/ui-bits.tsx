import { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  children,
  right,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <section className={["panel p-5 sm:p-6", className].join(" ")}>
      <header className="flex items-end justify-between gap-4 mb-5">
        <div>
          {eyebrow && <div className="label-eyebrow mb-1">{eyebrow}</div>}
          <h2 className="font-display text-base sm:text-lg font-semibold">{title}</h2>
        </div>
        {right}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-foreground/90 uppercase tracking-wider font-mono-ui">
          {label}
        </label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function ChipGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={[
              "px-3 py-1.5 rounded-sm text-xs font-medium transition-all border",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-surface-2 text-foreground/80 border-border hover:border-primary/50 hover:text-foreground",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-sm border transition-all text-left",
        checked
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-surface-2 hover:border-border/80",
      ].join(" ")}
    >
      <span className="text-sm">{label}</span>
      <span
        className={[
          "h-5 w-9 rounded-full relative transition-colors",
          checked ? "bg-primary" : "bg-muted",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
