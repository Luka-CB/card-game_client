"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface UpdateEmailStore {
  isChangeEmailModalOpen: boolean;
  toggleChangeEmailModal: () => void;
  sendRequestState: "idle" | "loading" | "success" | "error";
  sendRequestError: string | null;
  sendChangeEmailRequest: (email: string) => Promise<void>;
  confirmCodeStatus: "idle" | "loading" | "success" | "error";
  confirmCodeError: string | null;
  confirmChangeEmail: (code: string) => Promise<void>;
  reset: () => void;
}

const useUpdateEmailStore = create<UpdateEmailStore>((set) => ({
  isChangeEmailModalOpen: false,
  toggleChangeEmailModal: () =>
    set((state) => ({ isChangeEmailModalOpen: !state.isChangeEmailModalOpen })),
  sendRequestState: "idle",
  sendRequestError: null,
  sendChangeEmailRequest: async (email) => {
    set({ sendRequestState: "loading", sendRequestError: null });
    try {
      const { data } = await api.post("/emails/change/request", {
        newEmail: email,
      });
      if (data.success) {
        set({ sendRequestState: "success" });
      }
    } catch (error: AxiosError | any) {
      console.log(error);
      set({
        sendRequestState: "error",
        sendRequestError: error.response.data.error.message,
      });
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
    } catch (error: AxiosError | any) {
      console.log(error);
      set({
        confirmCodeStatus: "error",
        confirmCodeError: error.response.data.error.message,
      });
    }
  },
  reset: () =>
    set({
      sendRequestState: "idle",
      sendRequestError: null,
      confirmCodeStatus: "idle",
      confirmCodeError: null,
    }),
}));

export default useUpdateEmailStore;
