import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/brand/logo.png'
import { AUTH_ROUTES } from '../../modules/auth/constants/authRoutes.js'

// Site header from Figma node 1:347 — logo at the start, nav in the middle,
// auth actions at the end. RTL, so the logo sits on the right.
const NAV_LINKS = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/services', label: 'الخدمات' },
  { to: '/about', label: 'عن المنصه' },
  { to: '/contact', label: 'تواصل معنا' },
]

function Navbar() {
  return (
    <header
      dir="rtl"
      className="w-full border-b border-[#e6e8ea] bg-white px-[80px] pt-[16px] pb-[17px]"
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="عمّرها" className="h-[58px] w-[127px] object-contain" />
        </Link>

        <nav className="flex items-center gap-[24px]">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-[20px] leading-[1.5] ${
                  isActive
                    ? 'border-b-2 border-primary-500 pb-[6px] text-primary-500'
                    : 'rounded-[8px] px-[8px] py-[4px] text-[#454545]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-[16px]">
          <Link
            to={AUTH_ROUTES.login}
            className="rounded-[8px] border border-[#3b82f6] px-[25px] py-[9px] text-[16px] text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/10"
          >
            تسجيل الدخول
          </Link>
          <Link
            to={AUTH_ROUTES.customerSignUp}
            className="rounded-[8px] bg-[#3b82f6] px-[24px] py-[8px] text-[16px] text-white transition-colors hover:bg-primary-700"
          >
            انشاء حساب
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
