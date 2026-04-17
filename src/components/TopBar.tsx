import { useStore, ViewMode } from "@/lib/store";

function ModeButton({ value, label, hint }: { value: ViewMode; label: string; hint: string }) {
  const { view, setView } = useStore();
  const active = view === value;
  return (
    <button
      onClick={() => setView(value)}
      className={[
        "group relative px-4 py-2 rounded-sm text-sm font-medium transition-all",
        "font-mono-ui uppercase tracking-wider",
        active
          ? "bg-primary text-primary-foreground shadow-glow"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
      aria-pressed={active}
    >
      <span className="flex items-center gap-2">
        <span className={["h-1.5 w-1.5 rounded-full", active ? "bg-primary-foreground" : "bg-muted-foreground/50"].join(" ")} />
        {label}
      </span>
      <span className="sr-only">{hint}</span>
    </button>
  );
}

export function TopBar() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-9 w-9 rounded-sm bg-gradient-amber shadow-glow grid place-items-center">
              <span className="font-display text-primary-foreground font-bold text-sm">M</span>
            </div>
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-lg sm:text-xl font-semibold tracking-tight">
              MiCA Design Review Room
            </h1>
            <p className="text-xs text-muted-foreground">
              Pre-launch workspace for builders and lawyers
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-mono-ui uppercase tracking-wider text-primary/90">
            ETHSilesia 2026 · Legal from Day One
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-md bg-surface-2 border border-border">
          <ModeButton value="builder" label="Builder" hint="Configure protocol" />
          <ModeButton value="legal" label="Legal review" hint="Review and sign off" />
        </div>
      </div>
    </header>
  );
}
