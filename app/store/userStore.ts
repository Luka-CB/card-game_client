"use client";

import { create } from "zustand";

export interface userIFace {
  _id: string;
  username: string;
  avatar: string;
  email?: string;
  isVerified?: boolean;
}

interface UserStore {
  user: userIFace | null;
  loading: boolean;
  setEmail: (email: string) => void;
  setIsVerified: (isVerified: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  setEmail: (email: string) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, email };

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return { user: updatedUser };
      }
      return state;
    });
  },
  setIsVerified: (isVerified: boolean) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, isVerified };

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return { user: updatedUser };
      }
      return state;
    });
  },
}));

if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user") || "";
  useUserStore.setState({
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
  });
}

export default useUserStore;
