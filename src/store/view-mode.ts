import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ViewModeState {
  viewMode: 'card' | 'table' | 'map'
  setViewMode: (viewMode: 'card' | 'table' | 'map') => void
}

const getDefaultViewMode = (): 'card' | 'table' => {
  if (typeof window === 'undefined') return 'table'
  return window.matchMedia('(max-width: 767px)').matches ? 'card' : 'table'
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    set => ({
      viewMode: getDefaultViewMode(),
      setViewMode: value => set({ viewMode: value })
    }),
    { name: 'view-mode-store', storage: createJSONStorage(() => localStorage) }
  )
)
