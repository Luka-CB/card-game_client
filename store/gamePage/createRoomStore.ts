"use client";

import { create } from "zustand";

interface CreateRoomStore {
  toggleCreateRoomModal: { toggle: boolean; type: string | null };
  setToggleCreateRoom: (toggle: boolean, type: string | null) => void;
}

const useCreateRoomStore = create<CreateRoomStore>((set) => ({
  toggleCreateRoomModal: { toggle: false, type: null },
  setToggleCreateRoom: (toggle: boolean, type: string | null) =>
    set({ toggleCreateRoomModal: { toggle, type } }),
}));

export default useCreateRoomStore;
