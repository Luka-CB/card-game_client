import api from "@/utils/axios";
import { AxiosError } from "axios";
import { create } from "zustand";

interface DeleteUserStore {
  isDelModalOpen: boolean;
  toggleDelModal: () => void;
  status: "idle" | "loading" | "success" | "failed";
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
  status: "idle",
  error: null,
  deleteAccount: async (
    reason: { value: string; reasonNumber: number },
    additionalFeedback?: string,
  ) => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.delete("/users/account", {
        data: {
          reason,
          additionalFeedback,
        },
      });
      if (data.success) {
        set({ status: "success" });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error deleting user account:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error deleting user account:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useDeleteUserStore;
