import { create } from "zustand";

interface SoundStore {
  isMuted: boolean;
  volume: number;
  showSlider: boolean;
  setVolume: (volume: number) => void;
  toggleMute: (value?: boolean) => void;
  toggleSlider: (value?: boolean) => void;
}

const useSoundStore = create<SoundStore>((set) => ({
  isMuted: false,
  volume: 0.5,
  showSlider: false,
  setVolume: (volume: number) => set(() => ({ volume })),
  toggleMute: (value?: boolean) =>
    set((state) => ({ isMuted: value ?? !state.isMuted })),
  toggleSlider: (value?: boolean) =>
    set((state) => ({ showSlider: value ?? !state.showSlider })),
}));

export default useSoundStore;
