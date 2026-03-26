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
      };

      set({ user, status: "success" });
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AxiosError) {
        set({
          error: error.response?.data?.error?.message || "An error occurred",
          status: "failed",
        });
      } else {
        set({ error: "An unexpected error occurred", status: "failed" });
      }
    }
  },
}));

export default useSigninStore;
