import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import logo from '../../assets/brand/logo.png'
import { AUTH_ROUTES } from '../../modules/auth/constants/authRoutes.js'
import { signOut } from '../../modules/auth/services/authService.js'
import { readSession } from '../../modules/auth/services/authSession.js'
import { TECHNICIAN_NAV_ITEMS } from '../../modules/technician/constants/technicianRoutes.js'

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
  const navigate = useNavigate()

  const email = readSession()?.user?.email ?? ''

  // Revokes the refresh token server side, then clears the local session.
  //
  // The redirect does not wait on the outcome being a success: `signOut` clears
  // this device either way and reports whether the server agreed, so a failed
  // revoke still ends the session here rather than leaving someone who pressed
  // sign out looking at a signed-in screen.
  const handleSignOut = async () => {
    setMenuOpen(false)

    const { revoked } = await signOut()
    if (!revoked) {
      // Worth knowing about — the cookie outlives the click — but not worth
      // blocking the redirect or showing an error to someone who is leaving.
      console.warn('[auth] sign out could not revoke the session server side')
    }

    navigate(AUTH_ROUTES.login, { replace: true })
  }

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
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-[16px] px-[24px] pt-[16px] pb-[17px] lg:px-[80px]">
        {/* Brand sits at the start of the row — the right edge in RTL. */}
        <Link to={TECHNICIAN_NAV_ITEMS[0].to} className="shrink-0">
          <img
            src={logo}
            alt="عمّرها"
            className="h-[58px] w-[127px] object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-[24px] md:flex">
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
                    className={`block text-[20px] leading-[1.5] whitespace-nowrap transition-colors ${
                      active
                        ? 'border-b-2 border-primary-500 pb-[6px] text-primary-500'
                        : 'rounded-[8px] px-[8px] py-[4px] text-text-400 hover:text-primary-500'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="block cursor-default rounded-[8px] px-[8px] py-[4px] text-[20px] leading-[1.5] whitespace-nowrap text-text-400">
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        {/* Avatar first, bell last: in an RTL row the last child is the
            leftmost, and the frame puts the bell at the far left. */}
        <div className="flex items-center gap-[26px]">
          <div ref={menuRef} className="relative">
            {/* The frame fills this circle with the technician's photo. No
                account carries one, so the same circle holds the account icon
                rather than a stock face belonging to nobody. */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="حساب الفني"
              aria-expanded={menuOpen}
              className="flex size-[42px] items-center justify-center rounded-full bg-primary-50 text-primary-500 transition hover:ring-2 hover:ring-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <User size={21} aria-hidden="true" />
            </button>

            {/* Same menu the customer header has — profile, settings, sign
                out — so the two portals behave the same way, with the signed-in
                address above it. */}
            {menuOpen ? (
              <div className="absolute left-0 z-50 mt-[8px] w-[240px] rounded-[12px] border border-line bg-white py-[8px] text-[14px] shadow-raised">
                {email ? (
                  <p className="border-b border-line px-[16px] pb-[8px] text-right text-[13px] break-all text-text-300">
                    {email}
                  </p>
                ) : null}

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-[10px] px-[16px] py-[10px] text-text-400 transition-colors hover:bg-primary-50 hover:text-primary-500"
                >
                  <User size={16} aria-hidden="true" />
                  الملف الشخصي
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-[10px] px-[16px] py-[10px] text-text-400 transition-colors hover:bg-primary-50 hover:text-primary-500"
                >
                  <Settings size={16} aria-hidden="true" />
                  الإعدادات
                </Link>

                <span
                  aria-hidden="true"
                  className="my-[4px] block h-px bg-line"
                />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-right font-bold text-error-500 transition-colors hover:bg-error-50"
                >
                  <LogOut size={16} aria-hidden="true" />
                  تسجيل الخروج
                </button>
              </div>
            ) : null}
          </div>

          <span aria-hidden="true" className="h-[28px] w-px bg-primary-100" />

          <button
            type="button"
            aria-label="الإشعارات"
            className="relative flex size-[41px] items-center justify-center rounded-[20px] bg-primary-50 text-primary-500 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <Bell size={21} aria-hidden="true" />
            {/* Unread marker, flush with the top-right of the circle as the
                frame draws it. Decorative — the count belongs to the
                notifications screen, which is outside this scope. */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 size-[12px] rounded-full bg-success-500"
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
