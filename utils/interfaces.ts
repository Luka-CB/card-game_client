export interface RoomUser {
  id: string;
  username: string;
  status: string;
  avatar: string | null;
  botAvatar: string | null;
}

export interface Room {
  id: string;
  name: string;
  password: string | null;
  bett: string | null;
  type: "classic" | "nines" | "betting";
  status: "public" | "private";
  isActive?: boolean;
  hisht: string;
  createdAt: Date;
  users: RoomUser[];
}

export interface PlayingCard {
  id: string;
  suit: string;
  rank: string;
  strength: number;
  joker?: boolean;
  color?: string;
  type?: string;
  requestedSuit?: string;
}

export interface DrawnCard {
  playerId: string;
  cards: PlayingCard[];
}

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
export type Strength = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type Card =
  | { suit: Suit; rank: Rank; strength: Strength; id: string }
  | {
      joker: true;
      strength: string;
      id: string;
      color: string;
      type: string;
      requestedSuit: string;
    };

export interface HandBid {
  playerId: string;
  bids: {
    gameHand: number;
    bid: number;
  }[];
}

export interface HandWin {
  playerId: string;
  wins: {
    gameHand: number;
    win: number;
  }[];
}

export interface HandPoint {
  playerId: string;
  points: {
    gameHand: number;
    point: number;
  }[];
}

export interface ScoreBoard {
  playerId: string;
  playerName: string;
}

export interface PlayedCard {
  playerId: string;
  playerIndex: number;
  card: PlayingCard;
}

export interface GameInfo {
  id: string | null;
  roomId: string;
  status: string;
  players: string[] | null;
  dealerId: string | null;
  currentPlayerId: string | null;
  currentHand: number | null;
  handCount: number | null;
  trumpCard?: PlayingCard | null;
  hands?: { hand: PlayingCard[]; playerId: string }[] | null;
  handBids?: HandBid[] | null;
  handWins?: HandWin[] | null;
  handPoints?: HandPoint[] | null;
  playedCards?: PlayedCard[] | null;
  lastPlayedCards?: PlayedCard[] | null;
}
