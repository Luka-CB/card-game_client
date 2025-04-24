"use client";

import { Room, RoomUser } from "@/utils/interfaces";
import { create } from "zustand";

interface RoomStore {
  rooms: Room[];
  isCreatingRoom: boolean;
  togglePasswordPrompt: boolean;
  setRooms: (rooms: Room[]) => void;
  setIsCreatingRoom: (isCreatingRoom: boolean) => void;
  setTogglePasswordPrompt: (togglePasswordPrompt: boolean) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  roomUsers: [],
  isCreatingRoom: false,
  togglePasswordPrompt: false,
  setRooms: (rooms: Room[]) => set({ rooms }),
  setIsCreatingRoom: (isCreatingRoom: boolean) => set({ isCreatingRoom }),
  setTogglePasswordPrompt: (togglePasswordPrompt: boolean) =>
    set({ togglePasswordPrompt }),
}));

export default useRoomStore;
