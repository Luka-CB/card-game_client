"use client";

import { create } from "zustand";

interface TimerStore {
  duration: number | null;
  setDuration: (duration: number | null) => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  duration: null,
  setDuration: (duration: number | null) => set({ duration }),
}));

export default useTimerStore;
