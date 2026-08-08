import { useState, useCallback } from 'react'

const THEME_KEY = 'life-manager-theme'
export type Theme = 'white' | 'black'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) ?? 'black'
  })

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(THEME_KEY, t)
  }, [])

  return { theme, setTheme }
}