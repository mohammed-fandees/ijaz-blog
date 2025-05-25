// src/store/useSettingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReadingSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  fontFamily: 'amiri' | 'noto' | 'cairo'
  lineHeight: 'compact' | 'normal' | 'relaxed'
  textWidth: 'narrow' | 'normal' | 'wide'
  backgroundColor: 'white' | 'beige' | 'gray' | 'sepia'
  isDarkMode: boolean
}

interface SettingsState extends ReadingSettings {
  setFontSize: (size: ReadingSettings['fontSize']) => void
  setFontFamily: (family: ReadingSettings['fontFamily']) => void
  setLineHeight: (height: ReadingSettings['lineHeight']) => void
  setTextWidth: (width: ReadingSettings['textWidth']) => void
  setBackgroundColor: (color: ReadingSettings['backgroundColor']) => void
  setDarkMode: (isDark: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings: ReadingSettings = {
  fontSize: 'medium',
  fontFamily: 'amiri',
  lineHeight: 'normal',
  textWidth: 'normal',
  backgroundColor: 'white',
  isDarkMode: false,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setTextWidth: (textWidth) => set({ textWidth }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'reading-settings',
    }
  )
)
