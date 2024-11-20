import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "coffee",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "chat_theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
