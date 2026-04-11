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

export default useSendVerifyEmailStore;
