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
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error verifying email:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error verifying email:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useVerifyStore;
