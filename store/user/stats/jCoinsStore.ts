"use client";

import api from "@/utils/axios";
import { create } from "zustand";

interface jCoinsStore {
  status: "idle" | "loading" | "success" | "failed";
  jCoins: {
    value: string;
    raw: number;
  } | null;
  fetchJCoins: () => Promise<void>;
  isGetMoreModalOpen: boolean;
  hasWarning?: boolean;
  toggleGetMoreModal: (withWarning?: boolean) => void;
}

const useJCoinsStore = create<jCoinsStore>((set) => ({
  status: "idle",
  jCoins: null,
  isGetMoreModalOpen: false,
  hasWarning: false,
  toggleGetMoreModal: (withWarning?: boolean) =>
    set((state) => ({
      isGetMoreModalOpen: !state.isGetMoreModalOpen,
      hasWarning: withWarning || false,
    })),
  fetchJCoins: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get("/stats/get-jCoins");
      set({
        jCoins: { value: data.jCoins, raw: data.rawJCoins },
        status: "success",
      });
    } catch (error) {
      console.error("Failed to fetch jCoins:", error);
      set({ status: "failed" });
    }
  },
}));

export default useJCoinsStore;
