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
  users: {
    id: string;
    username: string;
    avatar: string | null;
  }[];
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

export interface RoomUser {
  id: string;
  username: string;
  avatar: string | null;
}

export type Card =
  | { suit: string; rank: string; id: string }
  | { joker: true; id: string; color: string };

export interface GameInfo {
  id: string | null;
  roomId: string;
  status: string;
  dealerId: string | null;
  currentHand: number | null;
  trumpCard: PlayingCard | null;
  hands: { hand: Card[]; playerId: string }[] | null;
}
