import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Focusable descendants, in DOM order. Queried on each keypress rather than
// cached because the dialog's contents change while it is open (offers stream
// in, fields appear), and a cached list would trap focus on removed nodes.
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const SIZES = {
  md: 'md:max-w-xl',
  lg: 'md:max-w-3xl',
  xl: 'md:max-w-5xl',
}

/**
 * Responsive dialog. Under `md` it is a bottom sheet that owns the full width
 * and at most 92% of the viewport height; from `md` up it is a centred dialog
 * capped at 90vh. Either way the header stays put and only the body scrolls,
 * which is what lets a tall form work on a short screen — the Figma frame drew
 * the panel 1438px tall, taller than any viewport it would ever open in.
 *
 * Renders through a portal so the site header's `z-50` sticky bar cannot sit
 * on top of the backdrop.
 */
function Modal({ open, onClose, title, description, size = 'lg', children }) {
  const panelRef = useRef(null)
  // The element that had focus before opening, so it can be handed focus back
  // on close — otherwise focus falls to <body> and keyboard users lose place.
  const openerRef = useRef(null)
  const headingId = useId()
  const descriptionId = useId()

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // Wrap in both directions so Tab never escapes to the page behind.
      if (
        event.shiftKey &&
        (active === first || !panelRef.current.contains(active))
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return undefined

    openerRef.current = document.activeElement

    // Lock the page behind the dialog. Padding compensates for the scrollbar
    // the lock removes, so the layout underneath does not shift.
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingInlineEnd
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingInlineEnd = `${scrollbar}px`

    // Move focus into the panel, preferring its first control over the panel
    // itself so a screen reader starts on something actionable.
    const raf = requestAnimationFrame(() => {
      const target =
        panelRef.current?.querySelector(FOCUSABLE) ?? panelRef.current
      target?.focus()
    })

    return () => {
      cancelAnimationFrame(raf)
      body.style.overflow = previousOverflow
      body.style.paddingInlineEnd = previousPadding
      openerRef.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-6"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="إغلاق النافذة"
        onClick={onClose}
        tabIndex={-1}
        className="reset-backdrop-enter absolute inset-0 h-full w-full cursor-default bg-text-500/50 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        dir="rtl"
        className={`emergency-panel-enter relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface shadow-raised outline-none md:max-h-[90dvh] md:rounded-2xl ${SIZES[size]}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4 md:px-8 md:py-5">
          <div className="min-w-0">
            <h2
              id={headingId}
              className="text-[18px] font-bold leading-[1.5] text-text-500 md:text-[24px]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 text-[13px] leading-[1.6] text-text-300 md:text-[16px]"
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-error-100 text-error-500 transition-colors hover:bg-error-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* The only scroll container in the dialog. `overscroll-contain` stops
            a flick at the end of the list from scrolling the page behind it. */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-8 md:py-7">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
