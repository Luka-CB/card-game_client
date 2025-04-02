"use client";

import api from "@/utils/axios";
import { create } from "zustand";

export interface userIFace {
  _id: string;
  username: string;
  avatar: string;
  email: string;
  isVerified: boolean;
  isInRoom: boolean;
}

interface UserStore {
  user: userIFace | null;
  loading: boolean;
  setUser: (user: userIFace | null) => void;
  getUser: () => Promise<void>;
  setIsVerified: (value: boolean) => void;
  setIsInRoom: (value: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
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
  setIsInRoom: (value: boolean) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, isInRoom: value };
        return { user: updatedUser };
      }
      return state;
    });
  },
}));

export default useUserStore;
