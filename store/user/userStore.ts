"use client";

import api from "@/utils/axios";
import { create } from "zustand";

export interface userIFace {
  _id: string;
  username: string;
  originalUsername: string;
  avatar: string;
  email: string;
  gender: "male" | "female" | null;
  isVerified: boolean;
  isAdmin: boolean;
  isGuest: boolean;
}

interface UserStore {
  user: userIFace | null;
  usersOnline: string[];
  loading: boolean;
  setUser: (user: userIFace | null) => void;
  setUsersOnline: (users: string[]) => void;
  getUser: () => Promise<void>;
  setIsVerified: (value: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  usersOnline: [],
  loading: true,
  joinedRoom: null,
  setUser: (user: userIFace | null) => set({ user }),
  setUsersOnline: (users: string[]) => set({ usersOnline: users }),
  getUser: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/users/session-user");
      set({ user: data || null, loading: false });
    } catch {
      // No active session — auto sign in as guest
      try {
        const { data: guestData } = await api.post("/auth/guest");
        set({ user: guestData || null, loading: false });
      } catch {
        set({ user: null, loading: false });
      }
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
