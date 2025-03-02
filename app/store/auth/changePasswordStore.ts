"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";
import { error } from "console";

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
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ error: error.response.data.error.message, status: "failed" });
    }
  },
}));

export default useChangePasswordStore;
