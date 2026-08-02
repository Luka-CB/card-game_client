"use client";

import api from "@/utils/axios";
import { create } from "zustand";

type UserLevel =
  | "novice"
  | "amateur"
  | "competent"
  | "promising"
  | "professional"
  | "diabolical"
  | "legend"
  | "joker";

interface UserLevelStore {
  levels: Record<string, UserLevel>;
  loadingIds: Record<string, boolean>;
  fetchUserLevel: (userId: string) => Promise<void>;
}

const useUserLevelStore = create<UserLevelStore>((set, get) => ({
  levels: {},
  loadingIds: {},
  fetchUserLevel: async (userId: string) => {
    if (!userId) return;

    const { levels, loadingIds } = get();
    if (levels[userId] || loadingIds[userId]) return;

    set((state) => ({
      loadingIds: { ...state.loadingIds, [userId]: true },
    }));

    try {
      const { data } = await api.get(`/users/meta/${userId}`);
      const level = data?.level as UserLevel | undefined;

      if (level) {
        set((state) => ({
          levels: { ...state.levels, [userId]: level },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user level:", error);
    } finally {
      set((state) => {
        const nextLoadingIds = { ...state.loadingIds };
        delete nextLoadingIds[userId];

        return {
          loadingIds: nextLoadingIds,
        };
      });
    }
  },
}));

export default useUserLevelStore;
