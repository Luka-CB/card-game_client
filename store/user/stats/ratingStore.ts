"use client";

import api from "@/utils/axios";
import { create } from "zustand";

interface ratingStore {
  status: "idle" | "loading" | "success" | "failed";
  rating: {
    value: number;
    trend: "up" | "down" | "stable";
  } | null;

  fetchRating: () => Promise<void>;
}

const useRatingStore = create<ratingStore>((set) => ({
  status: "idle",
  rating: null,
  fetchRating: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get("/stats/get-rating");
      set({
        rating: { value: data.rating, trend: data.trend },
        status: "success",
      });
    } catch (error) {
      console.error("Failed to fetch rating:", error);
      set({ status: "failed" });
    }
  },
}));

export default useRatingStore;
