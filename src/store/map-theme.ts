// src/store/map-theme.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type MapTheme = 'default' | 'light'

interface MapThemeState {
  mapTheme: MapTheme
  setMapTheme: (theme: MapTheme) => void
  toggleMapTheme: () => void
}

export const MAP_THEMES = {
  default: {
    label: 'Standart',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  light: {
    label: 'Açık',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
} as const

export const useMapThemeStore = create<MapThemeState>()(
  persist(
    set => ({
      mapTheme: 'default',
      setMapTheme: theme => set({ mapTheme: theme }),
      toggleMapTheme: () => set(state => ({ mapTheme: state.mapTheme === 'default' ? 'light' : 'default' }))
    }),
    { name: 'map-theme-store', storage: createJSONStorage(() => localStorage) }
  )
)
