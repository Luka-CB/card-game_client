"use client";

import { create } from "zustand";

interface GuestModalStore {
  isOpen: boolean;
  openGuestModal: () => void;
  closeGuestModal: () => void;
}

const useGuestModalStore = create<GuestModalStore>((set) => ({
  isOpen: false,
  openGuestModal: () => set({ isOpen: true }),
  closeGuestModal: () => set({ isOpen: false }),
}));

export default useGuestModalStore;
