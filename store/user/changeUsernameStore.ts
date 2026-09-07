import api from "@/utils/axios";
import { AxiosError } from "axios";
import { create } from "zustand";
import useUserAccountStore from "./userAccountStore";

interface ChangeUsernameStore {
  isChangeUsernameOpen: boolean;
  toggleChangeUsername: (value: boolean) => void;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  changeUsername: (newUsername: string) => Promise<void>;
  resetChangeUsernameState: () => void;
}

const useChangeUsernameStore = create<ChangeUsernameStore>((set) => ({
  isChangeUsernameOpen: false,
  status: "idle",
  error: null,
  toggleChangeUsername: (value: boolean) =>
    set({ isChangeUsernameOpen: value }),
  changeUsername: async (newUsername: string) => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.put("/users/username", { newUsername });
      if (data) {
        useUserAccountStore.getState().patchUserAccount({
          username: data.username,
          originalUsername: data.originalUsername,
        });
        set({ status: "success", error: null });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error changing username:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error changing username:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
  resetChangeUsernameState: () => set({ status: "idle", error: null }),
}));

export default useChangeUsernameStore;
