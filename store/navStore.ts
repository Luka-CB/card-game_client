import { create } from "zustand";

interface NavStore {
  isNavOpen: boolean;
  toggleNav: () => void;
}

const useNavStore = create<NavStore>((set) => ({
  isNavOpen: false,
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));

export default useNavStore;
