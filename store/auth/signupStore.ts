"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";
import { userIFace } from "../user/userStore";

interface UserData {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  gender: "male" | "female" | null;
  avatar?: string;
  password: string;
}

interface SignupStore {
  user: userIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  signup: (userData: UserData) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useSignupStore = create<SignupStore>((set) => ({
  user: null,
  status: "idle",
  error: null,
  reset: () => set({ status: "idle", error: null }),
  setError: (error) => set({ error }),
  signup: async (userData: UserData) => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/signup", userData);
      const user = {
        _id: data.data._id,
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        username: data.data.username,
        originalUsername: data.data.originalUsername,
        avatar: data.data.avatar,
        email: data.data.email,
        gender: data.data.gender,
        isVerified: data.data.isVerified,
        isAdmin: data.data.isAdmin,
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

export default useSignupStore;
