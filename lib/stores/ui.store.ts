import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  sidebarOpen: boolean;
  theme: Theme;
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      theme: "system",
      activeModal: null,
      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, "ui/setSidebarOpen"),
      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, "ui/toggleSidebar"),
      setTheme: (theme) => set({ theme }, false, "ui/setTheme"),
      openModal: (id) => set({ activeModal: id }, false, "ui/openModal"),
      closeModal: () => set({ activeModal: null }, false, "ui/closeModal"),
    }),
    { name: "UIStore" }
  )
);
