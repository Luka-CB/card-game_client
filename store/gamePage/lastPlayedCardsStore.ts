"use client";

import { create } from "zustand";

interface LastPlayedCardsStore {
  toggleLastPlayedCardsModal: boolean;
  setToggleLastPlayedCards: (value: boolean) => void;
}

const useLastPlayedCardsStore = create<LastPlayedCardsStore>((set) => ({
  toggleLastPlayedCardsModal: false,
  setToggleLastPlayedCards: (value: boolean) =>
    set({ toggleLastPlayedCardsModal: value }),
}));

export default useLastPlayedCardsStore;
