"use client";

import { create } from "zustand";
import api from "../../utils/axios";

interface LogoutStore {
  status: "idle" | "loading" | "success" | "failed";
  logout: () => void;
}

const useLogoutStore = create<LogoutStore>((set) => ({
  status: "idle",
  logout: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get(`/auth/logout`);

      if (data) {
        set({ status: "success" });
      }
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useLogoutStore;
