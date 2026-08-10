/**
 * Where the light/dark choice lives.
 *
 * The chosen theme is written to `data-theme` on the document element; every
 * colour in the design system is a CSS variable, and the dark values are
 * redefined under that attribute in `index.css`. Nothing else has to know a
 * theme changed — the variables move underneath the markup.
 */

export const THEME_STORAGE_KEY = 'ammarha-theme'

export const LIGHT = 'light'
export const DARK = 'dark'

const isTheme = (value) => value === LIGHT || value === DARK

const DARK_QUERY = '(prefers-color-scheme: dark)'

const media = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_QUERY)
    : null

/** What the operating system asks for. Light when it has no opinion. */
export const systemTheme = () => (media()?.matches ? DARK : LIGHT)

/**
 * The theme the visitor picked, or `null` when they never picked one.
 *
 * Storage throws rather than returns null in a few real situations — Safari's
 * private mode, a blocked third-party frame — and a theme is not worth failing
 * a page load over, so an unreadable store reads as "no choice yet" and the
 * system preference decides.
 */
export const readStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export const storeTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Same as above: the theme still applies for this visit, it just will not
    // survive the next one.
  }
}

/** The choice if there is one, otherwise the system preference. */
export const resolveTheme = () => readStoredTheme() ?? systemTheme()

/**
 * Puts the theme on the document.
 *
 * `color-scheme` is what makes the parts the page does not paint itself follow
 * along: scrollbars, form controls drawn by the browser, and the canvas behind
 * an overscroll.
 */
export const applyTheme = (theme) => {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

/**
 * Calls back when the system preference changes, and returns the unsubscribe.
 *
 * Only meaningful while no explicit choice is stored — the caller checks that,
 * since someone who picked light should stay in light when their laptop turns
 * the lights down at sunset.
 */
export const watchSystemTheme = (onChange) => {
  const query = media()
  if (!query) return () => {}

  const handle = (event) => onChange(event.matches ? DARK : LIGHT)
  query.addEventListener('change', handle)
  return () => query.removeEventListener('change', handle)
}
