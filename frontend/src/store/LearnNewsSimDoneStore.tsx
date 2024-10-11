import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearnNewsSimDoneStore {
  done: boolean;
  setDone: (done: boolean) => void;
}

export const useLearnNewsSimDoneStore = create(
  persist<LearnNewsSimDoneStore>(
    (set) => ({
      done: false,
      setDone: (done: boolean) => set({ done }),
    }),
    {
      name: "learn-news-sim-done-store", // Unique name for localStorage
      getStorage: () => localStorage, // Persist in localStorage
    }
  )
);