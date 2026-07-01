import api from "@/utils/axios";
import { create } from "zustand";

interface UserActivityStore {
  activities: {
    _id: string;
    activity: string;
    timestamp: string;
  }[];
  status: "idle" | "loading" | "success" | "failed";
  fetchUserActivities: () => Promise<void>;
}

const useUserActivityStore = create<UserActivityStore>((set) => ({
  activities: [],
  status: "idle",
  fetchUserActivities: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get("/activities/get");
      set({ activities: data, status: "success" });
    } catch (error: unknown) {
      console.error("Error fetching user activities:", error);
      set({ status: "failed" });
    }
  },
}));

export default useUserActivityStore;
