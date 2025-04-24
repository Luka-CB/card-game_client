"use client";

import { create } from "zustand";

interface CreateRoomStore {
  toggleCreateRoomModal: {
    toggle: boolean;
    type: "betting" | "classic" | "nines" | null;
  };
  setToggleCreateRoom: (
    toggle: boolean,
    type: "betting" | "classic" | "nines" | null
  ) => void;
}

const useCreateRoomStore = create<CreateRoomStore>((set) => ({
  toggleCreateRoomModal: { toggle: false, type: null },
  setToggleCreateRoom: (
    toggle: boolean,
    type: "betting" | "classic" | "nines" | null
  ) => set({ toggleCreateRoomModal: { toggle, type } }),
}));

export default useCreateRoomStore;
