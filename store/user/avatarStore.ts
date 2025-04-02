import { create } from "zustand";

interface AvatarStore {
  avatar: string | null;
  setAvatar: (avatar: string) => void;
}

const useAvatarStore = create<AvatarStore>((set) => ({
  avatar: null,
  setAvatar: (avatar: string) => set({ avatar }),
}));

export default useAvatarStore;
