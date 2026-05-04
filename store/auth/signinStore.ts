"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";
import { userIFace } from "../user/userStore";

interface SigninStore {
  user: userIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  signin: (userData: { username: string; password: string }) => Promise<void>;
  signinGuest: () => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useSigninStore = create<SigninStore>((set) => ({
  user: null,
  status: "idle",
  error: null,
  reset: () => set({ status: "idle", error: null }),
  setError: (error) => set({ error }),
  signin: async (userData: { username: string; password: string }) => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/signin", userData);
      const user = {
        _id: data._id,
        username: data.username,
        originalUsername: data.originalUsername,
        avatar: data.avatar,
        email: data.email,
        gender: data.gender,
        isVerified: data.isVerified,
        isAdmin: data.isAdmin,
        isGuest: data.isGuest,
      };

      set({ user, status: "success" });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error signing in:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error signing in:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
  signinGuest: async () => {
    set({ status: "loading", error: null });
    try {
      const { data } = await api.post("/auth/guest");
      const user = {
        _id: data._id,
        username: data.username,
        originalUsername: data.originalUsername,
        avatar: data.avatar,
        email: data.email,
        gender: data.gender,
        isVerified: data.isVerified,
        isAdmin: data.isAdmin,
        isGuest: data.isGuest,
      };

      set({ user, status: "success" });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error?.message || "An error occurred";
        if (status && status >= 500) {
          console.error("Error continuing as guest:", error);
        }
        set({
          status: "failed",
          error: message,
        });
      } else {
        console.error("Unexpected error continuing as guest:", error);
        set({
          status: "failed",
          error: "An unexpected error occurred",
        });
      }
    }
  },
}));

export default useSigninStore;
