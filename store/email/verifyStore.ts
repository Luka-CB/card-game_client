"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface VerifyStore {
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  verifyEmail: (token: string) => void;
}

const useVerifyStore = create<VerifyStore>((set) => ({
  email: null,
  status: "idle",
  error: null,
  verifyEmail: async (token: string) => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.put(`/emails/verify?token=${token}`);

      if (data) {
        set({ status: "success" });
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || "An error occurred",
          status: "failed",
        });
      } else {
        set({ error: "An unexpected error occurred", status: "failed" });
      }
    }
  },
}));

export default useVerifyStore;
