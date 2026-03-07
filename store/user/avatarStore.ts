import api from "@/utils/axios";
import { create } from "zustand";

interface AvatarStore {
  avatar: string | null;
  newAvatar: string | null;
  avatars: { _id: string; url: string; name: string }[];
  status: "idle" | "loading" | "success" | "failed";
  isAvatarGalleryOpen: boolean;
  toggleAvatarGallery: () => void;
  setAvatar: (avatar: string) => void;
  setNewAvatar: (avatar: string) => void;
  getAvatars: () => Promise<void>;
}

const useAvatarStore = create<AvatarStore>((set) => ({
  avatar: null,
  newAvatar: null,
  avatars: [],
  status: "idle",
  isAvatarGalleryOpen: false,
  toggleAvatarGallery: () =>
    set((state) => ({
      isAvatarGalleryOpen: !state.isAvatarGalleryOpen,
    })),
  setAvatar: (avatar: string) => set({ avatar }),
  setNewAvatar: (avatar: string) => set({ newAvatar: avatar }),
  getAvatars: async () => {
    set({ status: "loading" });
    try {
      const { data } = await api.get("/users/avatars");
      if (data) {
        set({ avatars: data, status: "success" });
      }
    } catch (error) {
      console.log(error);
      set({ status: "failed" });
    }
  },
}));

export default useAvatarStore;
