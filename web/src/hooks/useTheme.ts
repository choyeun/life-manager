import { useState, useCallback } from 'react'
import type { Theme } from '../types'

const THEME_KEY = 'life-manager-theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) ?? 'dark'
  })

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(THEME_KEY, t)
  }, [])

  return { theme, setTheme }
}