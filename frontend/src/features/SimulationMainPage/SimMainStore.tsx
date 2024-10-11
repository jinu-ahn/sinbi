import { create } from "zustand";

interface SimMainStore {
  mainStep: number;
  setMainStep: (step: number) => void;
}

export const useSimMainStore = create<SimMainStore>((set) => ({
  mainStep: 1, // 1단계에서 시작
  setMainStep: (mainStep: number) => set({ mainStep }),
}));
