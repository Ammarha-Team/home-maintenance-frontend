import { useCallback, useEffect, useMemo, useState } from 'react'

import { ThemeContext } from './themeContext.js'
import {
  DARK,
  LIGHT,
  applyTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  watchSystemTheme,
} from './themePreference.js'

/**
 * Holds the light/dark choice for the whole application.
 *
 * The first value is read synchronously rather than in an effect: the inline
 * script in `index.html` has already painted the document with the same
 * answer, and reading it during the first render is what keeps React's idea of
 * the theme and the document's from disagreeing for a frame.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // The system preference only leads while nothing has been chosen here. Once
  // someone picks a side, their pick outranks the operating system.
  useEffect(
    () =>
      watchSystemTheme((next) => {
        if (!readStoredTheme()) setThemeState(next)
      }),
    [],
  )

  const setTheme = useCallback((next) => {
    storeTheme(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === DARK ? LIGHT : DARK
      storeTheme(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ theme, isDark: theme === DARK, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
