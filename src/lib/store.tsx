import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { DesignState, LegalReview, LegalReviewState, ReviewPoint, ReviewStatus } from "./types";
import { defaultDesign, defaultLegalReview } from "./defaults";

export type ViewMode = "builder" | "legal";

interface StoreCtx {
  design: DesignState;
  setDesign: (updater: (d: DesignState) => DesignState) => void;
  applyDesign: (d: DesignState) => void;

  /** Active review state — always defined so existing UI has something to render. */
  legal: LegalReviewState;
  /** `null` until the Builder has explicitly handed over to Legal via setLegalReview. */
  legalReview: LegalReview | null;

  setReviewStatus: (id: string, status: ReviewStatus) => void;
  setReviewComment: (id: string, comment: string) => void;
  setReviewer: (r: Partial<LegalReviewState["reviewer"]>) => void;

  setLegalReview: (review: LegalReview) => void;
  updateReviewPoint: (id: string, patch: Partial<ReviewPoint>) => void;
  setReviewerMeta: (name: string, role: string) => void;
  setLegalLocked: (locked: boolean) => void;

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
  const [reviewInitialized, setReviewInitialized] = useState(false);
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

  const setLegalReview = useCallback((review: LegalReview) => {
    setLegal(review);
    setReviewInitialized(true);
  }, []);

  const updateReviewPoint = useCallback((id: string, patch: Partial<ReviewPoint>) => {
    setLegal(prev => ({
      ...prev,
      points: prev.points.map(p => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const setReviewerMeta = useCallback((name: string, role: string) => {
    setLegal(prev => ({ ...prev, reviewer: { name, role } }));
  }, []);

  const setLegalLocked = useCallback((locked: boolean) => {
    setLegal(prev => ({ ...prev, locked }));
  }, []);

  const legalReview: LegalReview | null = reviewInitialized ? legal : null;

  const value = useMemo<StoreCtx>(() => ({
    design, setDesign, applyDesign,
    legal, legalReview,
    setReviewStatus, setReviewComment, setReviewer,
    setLegalReview, updateReviewPoint, setReviewerMeta, setLegalLocked,
    view, setView,
    lastChangedAt, flashTick, triggerFlash,
  }), [
    design, setDesign, applyDesign,
    legal, legalReview,
    setReviewStatus, setReviewComment, setReviewer,
    setLegalReview, updateReviewPoint, setReviewerMeta, setLegalLocked,
    view, lastChangedAt, flashTick, triggerFlash,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

// Re-export for convenience
export type { ReviewPoint };
