import { create } from "zustand";

export interface LevelUpData {
  fromLevel: string;
  toLevel: string;
}

interface LevelUpStore {
  levelUp: LevelUpData | null;
  setLevelUp: (data: LevelUpData | null) => void;
}

const useLevelUpStore = create<LevelUpStore>((set) => ({
  levelUp: null,
  setLevelUp: (data) => set({ levelUp: data }),
}));

export default useLevelUpStore;
