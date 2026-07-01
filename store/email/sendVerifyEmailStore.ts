"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface SendVerifyEmailStore {
  email: string | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  sendEmail: () => void;
}

const useSendVerifyEmailStore = create<SendVerifyEmailStore>((set) => ({
  email: null,
  status: "idle",
  error: null,
  sendEmail: async () => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.post("/emails/send-email/verify-email");

      if (data) {
        set({ email: data.email, status: "success" });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error sending verification email:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error sending verification email:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useSendVerifyEmailStore;
