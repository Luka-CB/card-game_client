"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import { AxiosError } from "axios";
import { userIFace } from "../user/userStore";

interface SignupStore {
  user: userIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  signup: (userData: {
    username: string;
    email: string;
    gender: "male" | "female" | null;
    avatar?: string;
    password: string;
  }) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useSignupStore = create<SignupStore>((set) => ({
  user: null,
  status: "idle",
  error: null,
  reset: () => set({ status: "idle", error: null }),
  setError: (error) => set({ error }),
  signup: async (userData: {
    username: string;
    email: string;
    gender: "male" | "female" | null;
    avatar?: string;
    password: string;
  }) => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/signup", userData);
      const user = {
        _id: data.data._id,
        username: data.data.username,
        originalUsername: data.data.originalUsername,
        avatar: data.data.avatar,
        email: data.data.email,
        gender: data.data.gender,
        isVerified: data.data.isVerified,
        isAdmin: data.data.isAdmin,
      };

      set({ user, status: "success" });
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ error: error.response.data.error.message, status: "failed" });
    }
  },
}));

export default useSignupStore;
