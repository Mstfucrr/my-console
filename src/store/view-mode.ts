import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ViewModeState {
  viewMode: 'card' | 'table' | 'map'
  setViewMode: (viewMode: 'card' | 'table' | 'map') => void
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    set => ({
      viewMode: 'card',
      setViewMode: value => set({ viewMode: value })
    }),
    { name: 'view-mode-store', storage: createJSONStorage(() => localStorage) }
  )
)
