import api from "@/utils/axios";
import { create } from "zustand";

interface UserMetaStore {
  status: "idle" | "loading" | "failed" | "success";
  userMeta: {
    firstName: string;
    lastName: string;
    bio: string;
    memberSince: string;
    rating: number;
    level: string;
  } | null;
  fetchUserMeta: (userId: string) => Promise<void>;
  isMetaVisible: boolean;
  toggleMetaVisibility: (value: boolean) => void;
}

const useUserMetaStore = create<UserMetaStore>((set) => ({
  status: "idle",
  userMeta: null,
  fetchUserMeta: async (userId: string) => {
    set({ status: "loading" });
    try {
      const { data } = await api.get(`/users/meta/${userId}`);
      set({ userMeta: data, status: "success" });
    } catch (error) {
      console.error("Failed to fetch user meta:", error);
      set({ status: "failed" });
    }
  },
  isMetaVisible: false,
  toggleMetaVisibility: (value: boolean) =>
    set((state) => ({
      isMetaVisible: value !== undefined ? value : !state.isMetaVisible,
    })),
}));

export default useUserMetaStore;
