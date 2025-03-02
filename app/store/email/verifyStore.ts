"use client";

import { create } from "zustand";
import api from "../../utils/axios";

interface VerifyStore {
  status: "idle" | "loading" | "success" | "failed";
  verifyEmail: (token: string) => void;
}

const useVerifyStore = create<VerifyStore>((set) => ({
  email: null,
  status: "idle",
  verifyEmail: async (token: string) => {
    set({ status: "loading" });
    try {
      const { data } = await api.put(`/emails/verify?token=${token}`);

      if (data) {
        set({ status: "success" });
      }
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useVerifyStore;
