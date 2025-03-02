"use client";

import { create } from "zustand";
import api from "../../utils/axios";

interface ChangeEmailStore {
  status: "idle" | "loading" | "success" | "failed";
  updateEmail: (email: string) => void;
  reset: () => void;
}

const useChangeEmailStore = create<ChangeEmailStore>((set) => ({
  status: "idle",
  updateEmail: async (email: string) => {
    set({ status: "loading" });
    try {
      const { data } = await api.put("/emails/change-email", { email });
      if (data) {
        set({ status: "success" });
      }
    } catch (error) {
      set({ status: "failed" });
    }
  },
  reset: () => set({ status: "idle" }),
}));

export default useChangeEmailStore;
