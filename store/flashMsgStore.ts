import { create } from "zustand";

interface FlashMsgStore {
  msg: string | null;
  type: "error" | "success" | null;
  setMsg: (msg: string | null, type: "error" | "success" | null) => void;
}

const useFlashMsgStore = create<FlashMsgStore>((set) => ({
  msg: null,
  type: null,
  setMsg: (msg: string | null, type: "error" | "success" | null) =>
    set({ msg, type }),
}));

export default useFlashMsgStore;
