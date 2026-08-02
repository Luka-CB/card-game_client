"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface UpdateEmailStore {
  isChangeEmailModalOpen: boolean;
  toggleChangeEmailModal: () => void;
  sendRequestStatus: "idle" | "loading" | "success" | "failed";
  sendRequestError: string | null;
  sendChangeEmailRequest: (email: string) => Promise<void>;
  confirmCodeStatus: "idle" | "loading" | "success" | "failed";
  confirmCodeError: string | null;
  confirmChangeEmail: (code: string) => Promise<void>;
  reset: () => void;
}

const useUpdateEmailStore = create<UpdateEmailStore>((set) => ({
  isChangeEmailModalOpen: false,
  toggleChangeEmailModal: () =>
    set((state) => ({ isChangeEmailModalOpen: !state.isChangeEmailModalOpen })),
  sendRequestStatus: "idle",
  sendRequestError: null,
  sendChangeEmailRequest: async (email) => {
    set({ sendRequestStatus: "loading", sendRequestError: null });
    try {
      const { data } = await api.post("/emails/change/request", {
        newEmail: email,
      });
      if (data.success) {
        set({ sendRequestStatus: "success" });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error changing email:", error);
        }
        set({
          sendRequestStatus: "failed",
          sendRequestError: message,
        });
      } else {
        console.error("Unexpected error changing email:", error);
        set({
          sendRequestStatus: "failed",
          sendRequestError: "An unexpected error occurred",
        });
      }
    }
  },
  confirmCodeStatus: "idle",
  confirmCodeError: null,
  confirmChangeEmail: async (code) => {
    set({ confirmCodeStatus: "loading", confirmCodeError: null });
    try {
      const { data } = await api.post("/emails/change/verify", { code });
      if (data.success) {
        set({ confirmCodeStatus: "success" });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error changing email:", error);
        }
        set({
          confirmCodeStatus: "failed",
          confirmCodeError: message,
        });
      } else {
        console.error("Unexpected error changing email:", error);
        set({
          confirmCodeStatus: "failed",
          confirmCodeError: "An unexpected error occurred",
        });
      }
    }
  },
  reset: () =>
    set({
      sendRequestStatus: "idle",
      sendRequestError: null,
      confirmCodeStatus: "idle",
      confirmCodeError: null,
    }),
}));

export default useUpdateEmailStore;
