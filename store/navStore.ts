import { create } from "zustand";

interface NavStore {
  isNavOpen: boolean;
  toggleNav: (value?: boolean) => void;
}

const useNavStore = create<NavStore>((set) => ({
  isNavOpen: false,
  toggleNav: (value) =>
    set((state) => ({ isNavOpen: value ?? !state.isNavOpen })),
}));

export default useNavStore;
