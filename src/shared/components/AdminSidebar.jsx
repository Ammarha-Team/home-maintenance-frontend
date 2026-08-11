import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'


import {
  Settings,
  LogOut,
  User,
  Bell,
  Globe,
  Moon,
  ChevronDown,
} from 'lucide-react'

import logo from '../../assets/brand/logo.png'

function AdminSidebar({
  items = [],
  homeTo = '/',
  subtitle,
  footer,
  open = false,
  onNavigate,
  label = 'التنقل',
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleLogout = () => {
    // لو عندكم authentication حقيقي بعدين:
    // localStorage.removeItem('token')
    // localStorage.removeItem('user')

    setSettingsOpen(false)
    onNavigate?.()

    navigate('/')
  }

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 flex w-[260px] flex-col border-l border-line bg-white transition-transform md:translate-x-0 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="border-b border-line px-[24px] py-[20px]">
        <Link to={homeTo} onClick={onNavigate} className="block">
          <img
            src={logo}
            alt="عمّرها"
            className="h-[40px] w-auto"
          />
        </Link>

        {subtitle ? (
          <p className="mt-[10px] text-[14px] leading-[20px] text-text-300">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Navigation */}
      <nav
        aria-label={label}
        className="flex-1 overflow-y-auto py-[16px]"
      >
        <ul>
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.to

            if (item.ready === false) {
              return (
                <li key={item.key}>
                  <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-text-200">
                    {Icon ? (
                      <Icon size={20} aria-hidden="true" />
                    ) : null}

                    {item.label}
                  </span>
                </li>
              )
            }

            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  onClick={() => {
                    console.log('CLICKED:', item.label)
                    console.log('TO:', item.to)
                    onNavigate?.()
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] transition-colors ${
                    active
                      ? 'border-r-[3px] border-primary-500 bg-primary-50 font-bold text-primary-500'
                      : 'text-text-400 hover:bg-card hover:text-primary-500'
                  }`}
                >
                  {Icon ? (
                    <Icon size={20} aria-hidden="true" />
                  ) : null}

                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

{/* Bottom actions */}
<div className="border-t border-line px-[12px] py-[12px]">

  {/* Settings */}
  <div className="relative">
    <button
      type="button"
      onClick={() => setSettingsOpen((prev) => !prev)}
      className="flex w-full items-center justify-between rounded-[10px] px-[12px] py-[12px] text-[16px] text-text-400 transition-colors hover:bg-card hover:text-primary-500"
    >
      <span className="flex items-center gap-[12px]">
        <Settings size={22} />
        <span>الإعدادات</span>
      </span>

      <ChevronDown
        size={18}
        className={`transition-transform ${
          settingsOpen ? 'rotate-180' : ''
        }`}
      />
    </button>

    {/* Settings popup */}
    {settingsOpen && (
      <div className="absolute bottom-full right-0 mb-[8px] w-[294px] rounded-[16px] border border-line bg-white p-[10px] shadow-lg">

   <button
  type="button"
  onClick={() => {
    setSettingsOpen(false)
    navigate('/admin/settings')
  }}
  className="flex w-full items-center gap-[14px] rounded-[10px] px-[16px] py-[12px] text-[16px] hover:bg-card"
>
  <User size={22} />
  إعدادات الحساب
</button>


        <button
          type="button"
          className="flex w-full items-center gap-[14px] rounded-[10px] px-[16px] py-[12px] text-[16px] text-text-400 hover:bg-card"
        >
          <Moon size={22} />
          <span>الوضع الليلي</span>
        </button>

      </div>
    )}
  </div>

  {/* Logout - stays OUTSIDE the popup */}
  <button
    type="button"
    onClick={() => {
      onNavigate?.()
      navigate('/')
    }}
    className="mt-[4px] flex w-full items-center gap-[12px] rounded-[10px] px-[12px] py-[12px] text-[16px] text-red-500 transition-colors hover:bg-red-50"
  >
    <LogOut size={22} />
    <span>تسجيل خروج</span>
  </button>

</div>
    </aside>
  )
}

export default AdminSidebar