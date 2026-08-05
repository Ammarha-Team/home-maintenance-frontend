import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, User } from 'lucide-react'
import logo from '../../../assets/brand/logo.png'
import { TECHNICIAN_NAV_ITEMS } from '../constants/technicianRoutes.js'

/**
 * Header for the technician portal (Figma node 21:2235).
 *
 * Separate from the customer `HomeNavbar` on purpose: that one is wired to the
 * customer's tabs and its service-request modal, and reshaping it would change
 * the customer portal. This renders the technician tabs from
 * TECHNICIAN_NAV_ITEMS and shares nothing with it but the brand mark.
 */
function TechnicianNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // The frame draws the account menu closed, so only the trigger is
  // implemented here; the menu's destinations belong to screens outside this
  // scope.
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [menuOpen])

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50 w-full border-b border-line bg-white"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-[16px] px-[24px] py-[14px] lg:px-[40px]">
        {/* Brand sits at the start of the row — the right edge in RTL. */}
        <Link to={TECHNICIAN_NAV_ITEMS[0].to} className="shrink-0">
          <img
            src={logo}
            alt="عمّرها"
            className="h-[40px] w-[104px] object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-[32px] md:flex">
          {TECHNICIAN_NAV_ITEMS.map((item) => {
            const active = pathname === item.to

            return (
              <li key={item.key}>
                {/* A tab whose screen has not been built yet is text, not a
                    link: routing to an unregistered path would hit the
                    catch-all and leave the portal entirely. */}
                {item.ready ? (
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block py-[10px] text-[16px] transition-colors ${
                      active
                        ? 'font-bold text-primary-500'
                        : 'text-text-300 hover:text-primary-500'
                    }`}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-0 -bottom-[14px] h-[2px] w-full rounded-full bg-primary-500"
                      />
                    ) : null}
                  </Link>
                ) : (
                  <span className="block cursor-default py-[10px] text-[16px] text-text-200">
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        {/* Avatar first, bell last: in an RTL row the last child is the
            leftmost, and the frame puts the bell at the far left. */}
        <div className="flex items-center gap-[12px]">
          <div ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="حساب الفني"
              aria-expanded={menuOpen}
              className="flex size-[44px] items-center justify-center rounded-full border border-line bg-card text-text-300 transition hover:ring-2 hover:ring-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <User size={20} aria-hidden="true" />
            </button>
          </div>

          <span aria-hidden="true" className="h-[24px] w-px bg-primary-100" />

          <button
            type="button"
            aria-label="الإشعارات"
            className="relative flex size-[44px] items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <Bell size={20} aria-hidden="true" />
            {/* Unread marker. Decorative — the count belongs to the
                notifications screen, which is outside this scope. */}
            <span
              aria-hidden="true"
              className="absolute top-[9px] left-[11px] size-[10px] rounded-full border-2 border-white bg-success-500"
            />
          </button>
        </div>
      </div>

      {/* Under `md` the tabs move to a row of their own rather than a burger:
          five short labels fit, and a technician on a phone should not lose the
          portal's navigation behind a menu. */}
      <ul className="flex items-center gap-[20px] overflow-x-auto border-t border-line px-[24px] py-[10px] md:hidden">
        {TECHNICIAN_NAV_ITEMS.map((item) => (
          <li key={item.key} className="shrink-0">
            {item.ready ? (
              <Link
                to={item.to}
                aria-current={pathname === item.to ? 'page' : undefined}
                className={`block py-[11px] text-[15px] ${
                  pathname === item.to
                    ? 'font-bold text-primary-500'
                    : 'text-text-300'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="block py-[11px] text-[15px] text-text-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TechnicianNavbar
