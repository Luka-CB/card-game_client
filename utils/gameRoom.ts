import { PlayingCard } from "./interfaces";

interface BotBidProps {
  hand: PlayingCard[];
  trumpSuit: string;
  currentHand: number;
  isDealer: boolean;
  previousBids: number[];
}

export const calculateBotBid = ({
  hand,
  trumpSuit,
  currentHand,
  isDealer,
  previousBids,
}: BotBidProps): number => {
  const sumPreviousBids = previousBids.reduce((sum, bid) => sum + bid, 0);
  const strongCards = countStrongCards(hand, trumpSuit);

  let potentialBid = calculateBaseBid(strongCards, currentHand);

  potentialBid = adjustBidBasedOnPreviousBids(
    potentialBid,
    previousBids,
    currentHand,
    isDealer,
    sumPreviousBids
  );

  return potentialBid;
};

interface StrongCards {
  jokers: number;
  trumps: number;
  highCards: number;
}

const countStrongCards = (
  hand: PlayingCard[],
  trumpSuit: string
): StrongCards => {
  return hand.reduce(
    (count: any, card) => {
      if ("joker" in card && card.joker) {
        count.jokers++;
      } else if (card.suit === trumpSuit) {
        count.trumps++;
      } else if (["A", "K", "Q", "J"].includes(card.rank)) {
        count.highCards++;
      }
      return count;
    },
    { jokers: 0, trumps: 0, highCards: 0 }
  );
};

const calculateBaseBid = (
  strongCards: StrongCards,
  currentHand: number
): number => {
  let expectedWins = strongCards.jokers;
  expectedWins += strongCards.trumps * 0.8;
  expectedWins += strongCards.highCards * 0.5;

  return Math.min(Math.round(expectedWins), currentHand);
};

const adjustBidBasedOnPreviousBids = (
  baseBid: number,
  previousBids: number[],
  currentHand: number,
  isDealer: boolean,
  sumPreviousBids: number
): number => {
  let adjustedBid = baseBid;

  if (isDealer) {
    if (sumPreviousBids === currentHand) {
      adjustedBid = Math.max(1, adjustedBid);
    } else if (sumPreviousBids < currentHand) {
      const forbiddenBid = currentHand - sumPreviousBids;
      if (adjustedBid === forbiddenBid) {
        adjustedBid =
          Math.abs(forbiddenBid - 1 - baseBid) <
          Math.abs(forbiddenBid + 1 - baseBid)
            ? forbiddenBid - 1
            : Math.min(forbiddenBid + 1, currentHand);
      }
    }
  } else {
    const averageBidSofar = previousBids.length
      ? sumPreviousBids / previousBids.length
      : 0;

    if (averageBidSofar > currentHand / 4) {
      adjustedBid = Math.max(0, adjustedBid - 1);
    }
  }

  return Math.max(0, Math.min(adjustedBid, currentHand));
};
