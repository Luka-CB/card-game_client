"use client";

import api from "@/utils/axios";
import { AxiosError } from "axios";
import { create } from "zustand";

export interface UserStatsIFace {
  _id: string;
  userId: string;
  jCoins: number;
  gamesPlayed: number;
  gamesFinished: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  gamesLeft: number;
  topScore: number;
  rating: number;
  ratingHistory: { rating: number; timestamp: Date }[];
  ratingTrend: "up" | "down" | "stable";
}

interface userStatsStore {
  stats: UserStatsIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  fetchStats: () => Promise<void>;
}

const useUserStatsStore = create<userStatsStore>((set) => ({
  status: "idle",
  stats: null,
  error: null,
  fetchStats: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get("/stats");
      set({ stats: data.stats, status: "success" });
    } catch (error: AxiosError | any) {
      console.log(error);
      set({
        error:
          error.response?.data?.error?.message ||
          "An unexpected error occurred",
        status: "failed",
      });
    }
  },
}));

export default useUserStatsStore;
