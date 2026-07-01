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
  level:
    | "novice"
    | "amateur"
    | "competent"
    | "promising"
    | "professional"
    | "diabolical"
    | "legend"
    | "joker";
  progressionScore: number;
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error fetching user stats:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error fetching user stats:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useUserStatsStore;
