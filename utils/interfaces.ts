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
  joker?: boolean;
  color?: string;
}

export interface DrawnCard {
  playerId: string;
  cards: PlayingCard[];
}

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export type Card =
  | { suit: Suit; rank: Rank; id: string }
  | { joker: true; id: string; color: string };

export interface Score {
  gameHand: number;
  bid: number;
  win: number;
  points: number;
}

export interface ScoreBoard {
  playerId: string;
  playerName: string;
  scores: Score[] | null;
}

export interface GameInfo {
  id: string | null;
  roomId: string;
  status: string;
  players: string[] | null;
  dealerId: string | null;
  activePlayerIndex?: number | null;
  activePlayerId?: string | null;
  currentHand: number | null;
  trumpCard?: PlayingCard | null;
  hands?: { hand: Card[]; playerId: string }[] | null;
  scoreBoard?: ScoreBoard[] | null;
}
