import api from "@/utils/axios";
import { create } from "zustand";

interface UserActivityStore {
  activities: {
    _id: string;
    activity: string;
    timestamp: string;
  }[];
  state: "idle" | "loading" | "success" | "failed";
  fetchUserActivities: () => Promise<void>;
}

const useUserActivityStore = create<UserActivityStore>((set) => ({
  activities: [],
  state: "idle",
  fetchUserActivities: async () => {
    set({ state: "loading" });
    try {
      const { data } = await api.get("/activities/get");
      set({ activities: data, state: "success" });
      console.log("Fetched user activities:", data);
    } catch (error: unknown) {
      console.error("Error fetching user activities:", error);
      set({ state: "failed" });
    }
  },
}));

export default useUserActivityStore;
