import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import logo from '../../assets/brand/logo.png'
import { AUTH_ROUTES } from '../../modules/auth/constants/authRoutes.js'
import { signOut } from '../../modules/auth/services/authService.js'
import { readSession } from '../../modules/auth/services/authSession.js'
import { TECHNICIAN_NAV_ITEMS } from '../../modules/technician/constants/technicianRoutes.js'

import TechnicianNotificationPanel from "./TechnicianNotificationPanel";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false)
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
  <Link to={TECHNICIAN_NAV_ITEMS[0].to} className="shrink-0">
    <img
      src={logo}
      alt="عمّرها"
      className="h-[58px] w-[127px] object-contain"
    />
  </Link>

  <ul className="hidden items-center gap-[24px] md:flex">
    ...
  </ul>


{/* Right Actions */}
<div className="relative flex items-center gap-3">

  {/* User Menu */}
  <div className="relative" ref={menuRef}>
    <button
      type="button"
      onClick={() => setMenuOpen((open) => !open)}
      aria-label="حساب الفني"
      aria-expanded={menuOpen}
      className="flex size-[42px] items-center justify-center rounded-full bg-primary-50 text-primary-500 transition hover:ring-2 hover:ring-primary-300"
    >
      <User size={21} />
    </button>

    {menuOpen && (
      <div className="absolute left-0 top-[50px] z-50 w-[240px] rounded-[12px] border border-line bg-white py-[8px] shadow-raised">
        {email && (
          <p className="border-b border-line px-[16px] pb-[8px] text-right text-[13px] break-all text-text-300">
            {email}
          </p>
        )}

        <Link
          to="/profile"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-[10px] px-[16px] py-[10px] text-text-400 hover:bg-primary-50"
        >
          <User size={16} />
          الملف الشخصي
        </Link>

        <Link
          to="/settings"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-[10px] px-[16px] py-[10px] text-text-400 hover:bg-primary-50"
        >
          <Settings size={16} />
          الإعدادات
        </Link>

        <span className="my-[4px] block h-px bg-line" />

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-error-500 hover:bg-error-50"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    )}
  </div>

  {/* Notification */}
  <div className="relative">
    <button
      type="button"
      onClick={() => setNotificationsOpen((prev) => !prev)}
      aria-label="الإشعارات"
      className="flex size-[41px] items-center justify-center rounded-full bg-primary-50 text-primary-500 hover:bg-primary-100"
    >
      <Bell size={22} />
    </button>

    {notificationsOpen && (
      <div className="absolute left-0 top-[52px] z-[999]">
        <TechnicianNotificationPanel
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
    )}
  </div>

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
