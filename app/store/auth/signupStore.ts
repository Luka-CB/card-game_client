"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

interface SignupStore {
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
      };

      set({ status: "success" });
      Cookies.set("accessToken", data.data.accessToken, {
        secure: true,
        sameSite: "none",
        expires: 365 * 10,
      });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ error: error.response.data.error.message, status: "failed" });
    }
  },
}));

export default useSignupStore;
