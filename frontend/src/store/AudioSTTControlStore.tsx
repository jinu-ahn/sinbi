import { create } from "zustand";

interface AudioSTTControlStore {
  isAudioPlaying: boolean;
  setIsAudioPlaying: (done: boolean) => void;
}

export const useAudioSTTControlStore = create<AudioSTTControlStore>((set) => ({
  isAudioPlaying: true,
  setIsAudioPlaying: (audioState: boolean) =>
    set({ isAudioPlaying: audioState }),
}));