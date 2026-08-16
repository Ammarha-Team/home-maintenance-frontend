import { createContext, useContext } from 'react'

/**
 * The channel the toast provider publishes on, kept apart from the provider.
 *
 * Same reason as `themeContext.js`: a file that exports both a component and a
 * hook loses fast refresh, so the context and its reader live here and
 * `ToastProvider.jsx` exports only the component.
 */
export const ToastContext = createContext(null)

/**
 * Shows a passing message: `{ showToast, dismissToast }`.
 *
 * `showToast({ message, variant, duration })` — `variant` is 'success' or
 * 'error', `duration` is the milliseconds it stays before leaving on its own.
 *
 * Outside a provider both are no-ops rather than a thrown error. A screen
 * rendered on its own should still render; a lost confirmation message is not
 * worth a blank page.
 */
export function useToast() {
  return (
    useContext(ToastContext) ?? {
      showToast: () => {},
      dismissToast: () => {},
    }
  )
}
