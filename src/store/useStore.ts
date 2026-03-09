import { create } from "zustand";

interface StoreState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  unreadMessages: number;
  setUnreadMessages: (count: number) => void;
}

const useStore = create<StoreState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  notificationCount: 0,
  setNotificationCount: (count) => set({ notificationCount: count }),
  unreadMessages: 0,
  setUnreadMessages: (count) => set({ unreadMessages: count }),
}));

export default useStore;
