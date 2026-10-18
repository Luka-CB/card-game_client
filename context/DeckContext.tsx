"use client";

import React, { createContext, useContext } from "react";
import type { PlayingCard } from "@/utils/interfaces";

interface DeckContextValue {
  getCardUrl: (card: PlayingCard) => string;
  cardBackUrl: string;
}

const defaultGetCardUrl = (card: PlayingCard): string => {
  if (card.joker) {
    return card.color === "black"
      ? "/cards/joker-black.png"
      : "/cards/joker-red.png";
  }
  return `/cards/${card.suit}-${card.rank?.toLowerCase()}.png`;
};

const DeckContext = createContext<DeckContextValue>({
  getCardUrl: defaultGetCardUrl,
  cardBackUrl: "/cards/card-back.png",
});

export const DeckProvider: React.FC<{
  value: DeckContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
);

export const useDeckContext = () => useContext(DeckContext);
