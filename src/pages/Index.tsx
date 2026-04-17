import { StoreProvider, useStore } from "@/lib/store";
import { TopBar } from "@/components/TopBar";
import { BuilderView } from "@/views/BuilderView";
import { LegalReviewView } from "@/views/LegalReviewView";

function Shell() {
  const { view } = useStore();
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1">
        {view === "builder" ? <BuilderView /> : <LegalReviewView />}
      </main>
      <footer className="border-t border-border py-5">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono-ui text-muted-foreground uppercase tracking-wider">
          <span>MiCA Design Review Room · prototype</span>
          <span>Built at ETHSilesia 2026 · ETHLegal &amp; Finance track</span>
        </div>
      </footer>
    </div>
  );
}

const Index = () => (
  <StoreProvider>
    <Shell />
  </StoreProvider>
);

export default Index;
