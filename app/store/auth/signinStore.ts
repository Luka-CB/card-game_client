"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { userIFace } from "../user/userStore";

interface SigninStore {
  data: userIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  signin: (userData: { username: string; password: string }) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useSigninStore = create<SigninStore>((set) => ({
  data: null,
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
        isVerified: data.isVerified,
      };

      set({ status: "success", data: user });
      Cookies.set("accessToken", data.accessToken, {
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

export default useSigninStore;
