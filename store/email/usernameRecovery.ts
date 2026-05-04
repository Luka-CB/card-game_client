"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface UsernameRecoveryStore {
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  sendUsernameRecoveryEmail: (email: string) => Promise<void>;
  reset: () => void;
}

const useUsernameRecoveryStore = create<UsernameRecoveryStore>((set) => ({
  status: "idle",
  error: null,
  sendUsernameRecoveryEmail: async (email: string) => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.post("/emails/send-email/recover-username", {
        email,
      });
      if (data) {
        set({ status: "success", error: null });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error changing username:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error changing username:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
  reset: () => set({ status: "idle", error: null }),
}));

export default useUsernameRecoveryStore;
