"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

interface ChangePasswordStore {
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  setError: (value: string | null) => void;
  changePassword: (password: string, token: string) => Promise<void>;
  reset: () => void;
}

const useChangePasswordStore = create<ChangePasswordStore>((set) => ({
  status: "idle",
  error: null,
  setError: (error: string | null) => set({ error }),
  reset: () => set({ status: "idle" }),
  changePassword: async (password: string, token: string) => {
    set({ status: "loading" });
    try {
      const { data } = await api.put(`/auth/change-password`, {
        password,
        token,
      });

      if (data) {
        set({ status: "success" });
      }
    } catch (error: unknown) {
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
}));

export default useChangePasswordStore;
