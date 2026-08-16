import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'

import { ToastContext } from './toastContext.js'

const DEFAULT_DURATION = 4000

const VARIANTS = {
  success: {
    Icon: CheckCircle2,
    tone: 'text-success-600',
    ring: 'bg-success-100',
  },
  error: {
    Icon: CircleAlert,
    tone: 'text-error-500',
    ring: 'bg-error-50',
  },
}

/**
 * Passing confirmations for the whole application.
 *
 * These stand in for the `alert()` calls the customer screens used to raise. An
 * alert stops the page: nothing renders and nothing navigates until someone
 * dismisses a piece of browser chrome. A toast says the same thing and lets the
 * screen carry on underneath it, which is what makes "confirm, then move to the
 * next screen" possible at all.
 *
 * Mounted above the router, so a message raised just before a navigation is
 * still on screen when the next page arrives.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Timer handles by toast id, so one dismissed early leaves no timer behind.
  const timers = useRef(new Map())
  const nextId = useRef(1)

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id)

    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, variant = 'success', duration = DEFAULT_DURATION }) => {
      const id = nextId.current
      nextId.current += 1

      setToasts((current) => [...current, { id, message, variant }])

      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id)
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }, duration),
      )

      return id
    },
    [],
  )

  useEffect(() => {
    const pending = timers.current

    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Below the sticky navbar rather than over it, and centred so the
          position reads the same in Arabic as it would in English. `polite`
          because a confirmation should wait its turn rather than interrupt
          whatever a screen reader is already saying. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed top-20 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2"
        dir="rtl"
      >
        {toasts.map((toast) => {
          const { Icon, tone, ring } =
            VARIANTS[toast.variant] ?? VARIANTS.success

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-panel px-5 py-3.5 shadow-raised animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ring} ${tone}`}
              >
                <Icon size={20} />
              </span>

              <p className="text-sm font-semibold leading-relaxed text-text-500">
                {toast.message}
              </p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
