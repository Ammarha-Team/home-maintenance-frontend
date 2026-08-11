import { createContext, useContext } from 'react'

import { LIGHT } from './themePreference.js'

/**
 * The channel the provider publishes on, kept apart from the provider itself.
 *
 * A file that exports both a component and a hook loses fast refresh — editing
 * the hook remounts the tree instead of patching it — so the context and its
 * reader live here and `ThemeProvider.jsx` exports only the component.
 */
export const ThemeContext = createContext(null)

/**
 * The current theme and the ways to change it:
 * `{ theme, isDark, setTheme, toggleTheme }`.
 *
 * Falls back to a read-only light value outside a provider so a component
 * rendered on its own still renders instead of throwing over a colour scheme.
 */
export function useTheme() {
  return (
    useContext(ThemeContext) ?? {
      theme: LIGHT,
      isDark: false,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  )
}
