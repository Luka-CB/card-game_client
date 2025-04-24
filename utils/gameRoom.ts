import { DrawnCard, PlayingCard } from "./interfaces";

export const flattenDrawnCards = (
  playerOrder: string[],
  drawnCards: DrawnCard[]
) => {
  const sequence: { playerId: string; card: PlayingCard }[] = [];

  const maxCards = Math.max(...drawnCards.map((player) => player.cards.length));

  for (let cardIndex = 0; cardIndex < maxCards; cardIndex++) {
    for (const playerId of playerOrder) {
      const playerCards =
        drawnCards.find((player) => player.playerId === playerId)?.cards || [];
      if (cardIndex < playerCards.length) {
        sequence.push({
          playerId,
          card: playerCards[cardIndex],
        });
      }
    }
  }

  return sequence;
};
