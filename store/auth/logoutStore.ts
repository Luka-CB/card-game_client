"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import useUserStore from "../user/userStore";

interface LogoutStore {
  status: "idle" | "loading" | "success" | "failed";
  logout: () => Promise<boolean>;
  reset: () => void;
}

const useLogoutStore = create<LogoutStore>((set) => ({
  status: "idle",
  logout: async () => {
    set({ status: "loading" });
    try {
      await api.get(`/auth/logout`);
      useUserStore.getState().setUser(null);
      set({ status: "idle" });
      return true;
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
      return false;
    }
  },
  reset: () => set({ status: "idle" }),
}));

export default useLogoutStore;
