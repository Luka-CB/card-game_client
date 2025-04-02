"use client";

import { Room } from "@/utils/interfaces";
import { create } from "zustand";

interface RoomStore {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  setRooms: (rooms: Room[]) => set({ rooms }),
}));

export default useRoomStore;
