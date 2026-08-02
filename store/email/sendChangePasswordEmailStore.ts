"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface SendChangePasswordEmailStore {
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  sendChangePasswordEmail: (email: string) => Promise<void>;
  reset: () => void;
}

const buildChangePasswordRedirectUri = () => {
  if (typeof window === "undefined") return undefined;

  return `${window.location.origin}${window.location.pathname}?auth=change-password`;
};

const useSendChangePasswordEmailStore = create<SendChangePasswordEmailStore>(
  (set) => ({
    status: "idle",
    error: null,
    sendChangePasswordEmail: async (email: string) => {
      set({ status: "loading", error: null });
      try {
        const redirectUri = buildChangePasswordRedirectUri();
        const { data } = await api.post("/emails/send-email/change-password", {
          email,
          redirectUri,
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
            console.error("Error changing password:", error);
          }
          set({
            status: "failed",
            error: message,
          });
        } else {
          console.error("Unexpected error changing password:", error);
          set({
            status: "failed",
            error: "An unexpected error occurred",
          });
        }
      }
    },
    reset: () => set({ status: "idle", error: null }),
  }),
);

export default useSendChangePasswordEmailStore;
