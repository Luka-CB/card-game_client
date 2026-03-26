"use client";

import { create } from "zustand";

interface FilterStore {
  checkedFilters: {
    classic: boolean;
    nines: boolean;
    betting: boolean;
    public: boolean;
    private: boolean;
    chat: boolean;
    penalties: {
      "200": boolean;
      "500": boolean;
      "900": boolean;
    };
  };
  setCheckedFilters: (filters: FilterStore["checkedFilters"]) => void;
  showFilterOptions: boolean;
  toggleFilterOptions: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  checkedFilters: {
    classic: false,
    nines: false,
    betting: false,
    public: false,
    private: false,
    chat: false,
    penalties: {
      "200": false,
      "500": false,
      "900": false,
    },
  },
  setCheckedFilters: (filters) => set({ checkedFilters: filters }),
  showFilterOptions: false,
  toggleFilterOptions: () =>
    set((state) => ({ showFilterOptions: !state.showFilterOptions })),
}));

export default useFilterStore;
