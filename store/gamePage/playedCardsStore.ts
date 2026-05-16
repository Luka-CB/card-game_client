"use client";

import { create } from "zustand";

interface PlayedCardsStore {
  roundWinnerId: string | null;
  setRoundWinnerId: (id: string | null) => void;
}

const usePlayedCardsStore = create<PlayedCardsStore>((set) => ({
  roundWinnerId: null,
  setRoundWinnerId: (id) => set({ roundWinnerId: id }),
}));

export default usePlayedCardsStore;
