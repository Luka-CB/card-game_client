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
    avatar?: string;
    password: string;
  }) => {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/signup", userData);
      const user = {
        _id: data.data._id,
        username: data.data.username,
        avatar: data.data.avatar,
        email: data.data.email,
        isVerified: data.data.isVerified,
      };

      set({ user, status: "success" });
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ error: error.response.data.error.message, status: "failed" });
    }
  },
}));

export default useSignupStore;
