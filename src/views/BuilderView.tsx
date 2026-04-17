import { useStore } from "@/lib/store";
import { DesignForm } from "@/components/DesignForm";
import { AnalysisSnapshot } from "@/components/AnalysisSnapshot";

export function BuilderView() {
  const { setView } = useStore();
  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-1">Workspace · Builder</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Design the protocol
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the token and structure. The right panel reacts in real time.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5">
        <div className="space-y-5">
          <DesignForm />
          <div className="panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="label-eyebrow mb-1">Next step</div>
              <p className="text-sm">
                Hand the current design over to a legal reviewer.
              </p>
            </div>
            <button
              onClick={() => setView("legal")}
              className="px-5 py-2.5 rounded-sm bg-gradient-amber text-primary-foreground font-semibold text-sm shadow-glow hover:brightness-110 transition-all uppercase tracking-wider font-mono-ui"
            >
              Send to Legal review →
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <AnalysisSnapshot />
        </div>
      </div>
    </div>
  );
}
