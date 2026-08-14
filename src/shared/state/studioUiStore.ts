import { create } from "zustand";

export type StudioView = "model" | "simulate" | "analytics" | "compare";

interface StudioUiState {
  activeView: StudioView;
  insightsDrawerOpen: boolean;
  focusElementId: string | null;
  setActiveView: (view: StudioView) => void;
  toggleInsightsDrawer: () => void;
  setFocusElementId: (id: string | null) => void;
}

export const useStudioUiStore = create<StudioUiState>((set) => ({
  activeView: "model",
  insightsDrawerOpen: true,
  focusElementId: null,
  setActiveView: (view) => set({ activeView: view }),
  toggleInsightsDrawer: () => set((state) => ({ insightsDrawerOpen: !state.insightsDrawerOpen })),
  setFocusElementId: (id) => set({ focusElementId: id }),
}));
