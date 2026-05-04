"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";

export interface UserAccount {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  originalUsername: string;
  email: string;
  gender?: "male" | "female" | null;
  avatar: string;
  provider: "local" | "google" | "facebook";
  providerId: string;
  isVerified: boolean;
  isAdmin: boolean;
  bio?: string;
  emailChange?: {
    pendingEmail: string | undefined;
    emailChangeCode: string | undefined;
    emailChangeExpires: Date | undefined;
    emailChangeAttempts: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserAccountStore {
  userAccount: UserAccount | null;
  status: "idle" | "loading" | "success" | "error";
  updateStatus: "idle" | "loading" | "success" | "error";
  error: string | null;
  updateAvatarStatus: "idle" | "loading" | "success" | "error";
  fetchUserAccount: () => Promise<void>;
  updateUserAccount: (userData: Partial<UserAccount>) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  patchUserAccount: (patch: Partial<UserAccount>) => void;
}

const useUserAccountStore = create<UserAccountStore>((set) => ({
  userAccount: null,
  status: "idle",
  updateStatus: "idle",
  updateAvatarStatus: "idle",
  error: null,
  patchUserAccount: (patch) => {
    set((state) => ({
      userAccount: state.userAccount
        ? { ...state.userAccount, ...patch }
        : state.userAccount,
    }));
  },
  fetchUserAccount: async () => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.get("/users/account");
      set({ userAccount: data, status: "success" });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || error.message,
          status: "error",
        });
      } else {
        set({ error: "An unexpected error occurred", status: "error" });
      }
    }
  },
  updateUserAccount: async (userData: Partial<UserAccount>) => {
    set({ updateStatus: "loading", error: null });
    try {
      const { data } = await api.put("/users/account", userData);
      set({ userAccount: data, updateStatus: "success" });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error updating user account:", error);
        }
        set({
          updateStatus: "error",
          error: message,
        });
      } else {
        console.error("Unexpected error updating user account:", error);
        set({
          updateStatus: "error",
          error: "An unexpected error occurred",
        });
      }
    }
  },
  updateUserAvatar: async (avatarUrl: string) => {
    set({ updateAvatarStatus: "loading", error: null });
    try {
      const { data } = await api.put("/users/avatar", { avatarUrl });
      set({ userAccount: data, updateAvatarStatus: "success" });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error updating user avatar:", error);
        }
        set({
          updateAvatarStatus: "error",
          error: message,
        });
      } else {
        console.error("Unexpected error updating user avatar:", error);
        set({
          updateAvatarStatus: "error",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useUserAccountStore;
