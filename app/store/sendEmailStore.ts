"use client";

import { create } from "zustand";
import api from "../utils/axios";

interface SendEmailStore {
  email: string | null;
  status: "idle" | "loading" | "success" | "failed";
  sendEmail: () => void;
}

const useSendEmailStore = create<SendEmailStore>((set) => ({
  email: null,
  status: "idle",
  sendEmail: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/send-email");

      if (data) {
        set({ email: data.email, status: "success" });
      }
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useSendEmailStore;
