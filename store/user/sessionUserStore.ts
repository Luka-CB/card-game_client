"use client";

import { create } from "zustand";
import api from "../../utils/axios";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { userIFace } from "./userStore";

interface SessionUserStore {
  data: userIFace | null;
  status: "idle" | "loading" | "success" | "failed";
  getSessionUser: () => void;
}

const useSessionUserStore = create<SessionUserStore>((set) => ({
  data: null,
  status: "idle",
  getSessionUser: async () => {
    set((state) => ({ ...state, status: "loading" }));
    try {
      const { data } = await api.get("/users/session-user");
      const user = {
        _id: data._id,
        username: data.username,
        originalUsername: data.originalUsername,
        avatar: data.avatar,
        email: data.email,
        isVerified: data.isVerified,
      };

      set((state) => ({ ...state, data: user, status: "success" }));
      Cookies.set("accessToken", data.accessToken, {
        secure: true,
        sameSite: "none",
        expires: 365 * 10,
      });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: AxiosError | any) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useSessionUserStore;
