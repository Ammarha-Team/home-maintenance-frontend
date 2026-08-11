import { Moon, Sun } from 'lucide-react'

import { useTheme } from '../theme/themeContext.js'

/**
 * The light/dark switch that sits in the navigation bars.
 *
 * Both icons are mounted at once, stacked on top of each other, and the change
 * is a rotate-and-fade between them. Swapping one element for the other would
 * be a jump; keeping both means the sun can turn out as the moon turns in, and
 * the control reads as one thing changing state rather than two things
 * replacing each other.
 *
 * The icon shows the theme that is on now — a sun in light mode, a moon in dark
 * — and the accessible name says what pressing it will do, which is the part a
 * screen reader needs and the picture cannot carry.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for the button, so a bar with
 *                                   its own sizing can place it without this
 *                                   component knowing about that bar.
 * @param {boolean} [props.compact]  The 36px square the narrow layouts use for
 *                                   their round controls, instead of 40px.
 */
function ThemeToggle({ className = '', compact = false }) {
  const { isDark, toggleTheme } = useTheme()

  const size = compact ? 'h-9 w-9' : 'h-10 w-10'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      className={`relative flex ${size} shrink-0 items-center justify-center rounded-full border border-line bg-card text-text-400 transition-colors hover:border-primary-400 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${className}`}
    >
      <Sun
        size={18}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        size={18}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
      />
    </button>
  )
}

export default ThemeToggle
