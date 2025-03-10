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
        avatar: data.avatar,
        email: data.email,
        isVerified: data.isVerified,
      };

      set({ user, status: "success" });
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ error: error.response.data.error.message, status: "failed" });
    }
  },
}));

export default useSigninStore;
