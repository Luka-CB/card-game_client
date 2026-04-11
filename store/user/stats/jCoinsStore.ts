"use client";

import api from "@/utils/axios";
import { create } from "zustand";

interface JCoinsBalance {
  value: string;
  raw: number;
}

interface DailyFreeClaimState {
  amount: number;
  canClaim: boolean;
  nextClaimAt: string | null;
  msRemaining: number;
}

interface jCoinsStore {
  status: "idle" | "loading" | "success" | "failed";
  jCoins: JCoinsBalance | null;
  fetchJCoins: () => Promise<void>;
  clearJCoins: () => void;

  isGetMoreModalOpen: boolean;
  hasWarning?: boolean;
  toggleGetMoreModal: (withWarning?: boolean) => void;

  dailyClaimStatus: "idle" | "loading" | "success" | "failed";
  dailyClaim: DailyFreeClaimState | null;
  fetchDailyClaimStatus: () => Promise<void>;
  claimDailyFreeJCoins: () => Promise<number | null>;
}

const useJCoinsStore = create<jCoinsStore>((set) => ({
  status: "idle",
  jCoins: null,
  isGetMoreModalOpen: false,
  hasWarning: false,

  dailyClaimStatus: "idle",
  dailyClaim: null,

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

  clearJCoins: () => set({ jCoins: null, status: "idle" }),

  fetchDailyClaimStatus: async () => {
    set({ dailyClaimStatus: "loading" });
    try {
      const { data } = await api.get("/stats/daily-free-claim/status");

      set({
        dailyClaimStatus: "success",
        dailyClaim: {
          amount: data.claim.amount,
          canClaim: data.claim.canClaim,
          nextClaimAt: data.claim.nextClaimAt,
          msRemaining: data.claim.msRemaining,
        },
        jCoins: data.jCoins,
      });
    } catch (error) {
      console.error("Failed to fetch daily claim status:", error);
      set({ dailyClaimStatus: "failed" });
    }
  },

  claimDailyFreeJCoins: async () => {
    try {
      const { data } = await api.post("/stats/daily-free-claim");

      set({
        jCoins: data.jCoins,
        dailyClaimStatus: "success",
        dailyClaim: {
          amount: data.reward.amount,
          canClaim: data.claim.canClaim,
          nextClaimAt: data.claim.nextClaimAt,
          msRemaining: data.claim.msRemaining,
        },
      });

      return data.reward.amount as number;
    } catch (error) {
      console.error("Failed to claim daily free JCoins:", error);
      return null;
    }
  },
}));

export default useJCoinsStore;
