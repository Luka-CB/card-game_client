"use client";

import { Room } from "@/utils/interfaces";
import { create } from "zustand";

interface RoomStore {
  rooms: Room[];
  totalRoomsCount: number;
  isCreatingRoom: boolean;
  togglePasswordPrompt: boolean;
  setRooms: (rooms: Room[], totalRoomsCount?: number) => void;
  setIsCreatingRoom: (isCreatingRoom: boolean) => void;
  setTogglePasswordPrompt: (togglePasswordPrompt: boolean) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  totalRoomsCount: 0,
  isCreatingRoom: false,
  togglePasswordPrompt: false,
  setRooms: (rooms: Room[], totalRoomsCount?: number) =>
    set({ rooms, totalRoomsCount: totalRoomsCount ?? rooms.length }),
  setIsCreatingRoom: (isCreatingRoom: boolean) => set({ isCreatingRoom }),
  setTogglePasswordPrompt: (togglePasswordPrompt: boolean) =>
    set({ togglePasswordPrompt }),
}));

export default useRoomStore;
