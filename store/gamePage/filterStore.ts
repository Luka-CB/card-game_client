"use client";

import { create } from "zustand";
import Cookies from "js-cookie";

const HIDE_DUMMY_COOKIE = "hideDummyRooms";

const persistedHideDummy = (() => {
  try {
    const val = Cookies.get(HIDE_DUMMY_COOKIE);
    return val === "true";
  } catch {
    return false;
  }
})();

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
    hideDummyRooms: boolean;
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
    hideDummyRooms: persistedHideDummy,
  },
  setCheckedFilters: (filters) => {
    Cookies.set(HIDE_DUMMY_COOKIE, String(filters.hideDummyRooms), {
      expires: 365,
    });
    set({ checkedFilters: filters });
  },
  showFilterOptions: false,
  toggleFilterOptions: () =>
    set((state) => ({ showFilterOptions: !state.showFilterOptions })),
}));

export default useFilterStore;
