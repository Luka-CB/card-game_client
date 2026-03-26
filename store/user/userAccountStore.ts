"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import Cookies from "js-cookie";
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
  state: "idle" | "loading" | "success" | "error";
  updateState: "idle" | "loading" | "success" | "error";
  error: string | null;
  updateAvatarState: "idle" | "loading" | "success" | "error";
  fetchUserAccount: () => Promise<void>;
  updateUserAccount: (userData: Partial<UserAccount>) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
}

const useUserAccountStore = create<UserAccountStore>((set) => ({
  userAccount: null,
  state: "idle",
  updateState: "idle",
  updateAvatarState: "idle",
  error: null,
  fetchUserAccount: async () => {
    set({ state: "loading", error: null });
    try {
      const { data } = await api.get("/users/account");
      set({ userAccount: data, state: "success" });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || error.message,
          state: "error",
        });
      } else {
        set({ error: "An unexpected error occurred", state: "error" });
      }
    }
  },
  updateUserAccount: async (userData: Partial<UserAccount>) => {
    set({ updateState: "loading", error: null });
    try {
      const { data } = await api.put("/users/account", userData);
      set({ userAccount: data, updateState: "success" });
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || error.message,
          updateState: "error",
        });
      } else {
        set({ error: "An unexpected error occurred", updateState: "error" });
      }
    }
  },
  updateUserAvatar: async (avatarUrl: string) => {
    set({ updateAvatarState: "loading", error: null });
    try {
      const { data } = await api.put("/users/avatar", { avatarUrl });
      set({ userAccount: data, updateAvatarState: "success" });
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || error.message,
          updateAvatarState: "error",
        });
      } else {
        set({
          error: "An unexpected error occurred",
          updateAvatarState: "error",
        });
      }
    }
  },
}));

export default useUserAccountStore;
