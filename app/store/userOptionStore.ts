import { create } from "zustand";

interface UserOptionStore {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const useUserOptionStore = create<UserOptionStore>((set) => ({
  isOpen: false,
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));

export default useUserOptionStore;
