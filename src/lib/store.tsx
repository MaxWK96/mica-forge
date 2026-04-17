import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { DesignState, LegalReviewState, ReviewPoint, ReviewStatus } from "./types";
import { defaultDesign, defaultLegalReview } from "./defaults";

export type ViewMode = "builder" | "legal";

interface StoreCtx {
  design: DesignState;
  setDesign: (updater: (d: DesignState) => DesignState) => void;
  applyDesign: (d: DesignState) => void;
  legal: LegalReviewState;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
  setReviewComment: (id: string, comment: string) => void;
  setReviewer: (r: Partial<LegalReviewState["reviewer"]>) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  lastChangedAt: number;
  flashTick: number;
  triggerFlash: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<DesignState>(defaultDesign);
  const [legal, setLegal] = useState<LegalReviewState>(defaultLegalReview);
  const [view, setView] = useState<ViewMode>("builder");
  const [lastChangedAt, setLastChangedAt] = useState(Date.now());
  const [flashTick, setFlashTick] = useState(0);

  const setDesign = useCallback((updater: (d: DesignState) => DesignState) => {
    setDesignState(prev => updater(prev));
    setLastChangedAt(Date.now());
  }, []);

  const applyDesign = useCallback((d: DesignState) => {
    setDesignState(d);
    setLastChangedAt(Date.now());
    setFlashTick(t => t + 1);
  }, []);

  const triggerFlash = useCallback(() => setFlashTick(t => t + 1), []);

  const setReviewStatus = useCallback((id: string, status: ReviewStatus) => {
    setLegal(prev => ({
      ...prev,
      points: prev.points.map(p => (p.id === id ? { ...p, status } : p)),
    }));
  }, []);
  const setReviewComment = useCallback((id: string, comment: string) => {
    setLegal(prev => ({
      ...prev,
      points: prev.points.map(p => (p.id === id ? { ...p, comment } : p)),
    }));
  }, []);
  const setReviewer = useCallback((r: Partial<LegalReviewState["reviewer"]>) => {
    setLegal(prev => ({ ...prev, reviewer: { ...prev.reviewer, ...r } }));
  }, []);

  const value = useMemo<StoreCtx>(() => ({
    design, setDesign, applyDesign,
    legal, setReviewStatus, setReviewComment, setReviewer,
    view, setView,
    lastChangedAt, flashTick, triggerFlash,
  }), [design, setDesign, applyDesign, legal, setReviewStatus, setReviewComment, setReviewer, view, lastChangedAt, flashTick, triggerFlash]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

// Re-export for convenience
export type { ReviewPoint };
