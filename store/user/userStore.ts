"use client";

import api from "@/utils/axios";
import { create } from "zustand";

export interface userIFace {
  _id: string;
  username: string;
  avatar: string;
  email: string;
  isVerified: boolean;
}

interface Room {
  id: string;
  name: string;
  password: string | null;
  bett: string | null;
  type: "classic" | "nines" | "betting";
  status: "public" | "private";
  hisht: string;
  createdAt: Date;
}

interface UserStore {
  user: userIFace | null;
  loading: boolean;
  setUser: (user: userIFace | null) => void;
  getUser: () => Promise<void>;
  setIsVerified: (value: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  joinedRoom: null,
  setUser: (user: userIFace | null) => set({ user }),
  getUser: async () => {
    try {
      const { data } = await api.get("/users/session-user");
      if (data) {
        set({ user: data, loading: false });
      }
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
  setIsVerified: (value: boolean) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, isVerified: value };
        return { user: updatedUser };
      }
      return state;
    });
  },
}));

export default useUserStore;
