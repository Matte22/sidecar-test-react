import { create } from 'zustand'
type UIState = { sidebarOpen: boolean; setOpen: (v: boolean) => void }
export const useUI = create<UIState>(set => ({
  sidebarOpen: false,
  setOpen: v => set({ sidebarOpen: v })
}))
