import api from "@/utils/axios";
import { AxiosError } from "axios";
import { create } from "zustand";

interface DeleteUserStore {
  isDelModalOpen: boolean;
  toggleDelModal: () => void;
  state: "idle" | "loading" | "success" | "failed";
  error: string | null;
  deleteAccount: (
    reason: { value: string; reasonNumber: number },
    additionalFeedback?: string,
  ) => Promise<void>;
}

const useDeleteUserStore = create<DeleteUserStore>((set) => ({
  isDelModalOpen: false,
  toggleDelModal: () =>
    set((state) => ({ isDelModalOpen: !state.isDelModalOpen })),
  state: "idle",
  error: null,
  deleteAccount: async (
    reason: { value: string; reasonNumber: number },
    additionalFeedback?: string,
  ) => {
    set({ state: "loading", error: null });
    try {
      const { data } = await api.delete("/users/account", {
        data: {
          reason,
          additionalFeedback,
        },
      });
      if (data.success) {
        set({ state: "success" });
      }
    } catch (error: AxiosError | any) {
      console.log(error);
      set({
        error: error.response?.data?.error?.message || "An error occurred",
        state: "failed",
      });
    }
  },
}));

export default useDeleteUserStore;
