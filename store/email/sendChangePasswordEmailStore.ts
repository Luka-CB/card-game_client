"use client";

import { create } from "zustand";
import api from "../../utils/axios";

interface SendChangePasswordEmailStore {
  status: "idle" | "loading" | "success" | "failed";
  sendChangePasswordEmail: (email: string) => Promise<void>;
}

const useSendChangePasswordEmailStore = create<SendChangePasswordEmailStore>(
  (set) => ({
    status: "idle",
    sendChangePasswordEmail: async (email: string) => {
      set({ status: "loading" });
      try {
        const { data } = await api.post("/emails/send-email/change-password", {
          email,
        });

        if (data) {
          set({ status: "success" });
        }
      } catch (error) {
        console.log(error);
        set({ status: "failed" });
      }
    },
  })
);

export default useSendChangePasswordEmailStore;
