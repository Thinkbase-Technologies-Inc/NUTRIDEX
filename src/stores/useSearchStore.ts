"use client";

import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
  query: string;
  selectedGroup: string; // "all" or specific groupId
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  setSelectedGroup: (groupId: string) => void;
  clearQuery: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: "",
  selectedGroup: "all",

  openSearch: (initialQuery = "") => {
    set({
      isOpen: true,
      query: initialQuery,
    });
  },

  closeSearch: () => {
    set({
      isOpen: false,
    });
  },

  setQuery: (query: string) => {
    set({ query });
  },

  setSelectedGroup: (selectedGroup: string) => {
    set({ selectedGroup });
  },

  clearQuery: () => {
    set({ query: "", selectedGroup: "all" });
  },
}));
