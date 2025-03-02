"use client";

import { create } from "zustand";
import api from "../../utils/axios";

interface SendVerifyEmailStore {
  email: string | null;
  status: "idle" | "loading" | "success" | "failed";
  sendEmail: () => void;
}

const useSendVerifyEmailStore = create<SendVerifyEmailStore>((set) => ({
  email: null,
  status: "idle",
  sendEmail: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/emails/send-email/verify-email");

      if (data) {
        set({ email: data.email, status: "success" });
      }
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useSendVerifyEmailStore;
