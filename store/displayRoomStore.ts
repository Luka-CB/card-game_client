import { create } from "zustand";

interface DisplayRoomStore {
  displayRoomType: {
    type: "classic" | "nines" | "betting" | "none";
    withUser: boolean;
  };
  setDisplayRoomType: (data: {
    type: "classic" | "nines" | "betting" | "none";
    withUser: boolean;
  }) => void;
}

const useDisplayRoomStore = create<DisplayRoomStore>((set) => ({
  displayRoomType: { type: "none", withUser: false },
  setDisplayRoomType: (data) => set({ displayRoomType: data }),
}));

export default useDisplayRoomStore;
