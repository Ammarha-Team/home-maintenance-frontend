import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCheck,
  Menu,
  Search,
  Wrench,
  ShoppingCart,
  Info,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminTopbar({
  onOpenSidebar,
  user,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'البحث...',
  showSearch = true,
  notifications = [],
  actions,
}) {
  const navigate = useNavigate()

  const [ownQuery, setOwnQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notificationRef = useRef(null)
  const previousUnreadCount = useRef(0)

  const controlled = searchValue !== undefined
  const query = controlled ? searchValue : ownQuery

  // عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  // البحث
  const handleChange = (event) => {
    const next = event.target.value

    if (!controlled) {
      setOwnQuery(next)
    }

    onSearchChange?.(next)
  }

  // صوت عند وصول إشعار جديد
  useEffect(() => {
    if (unreadCount > previousUnreadCount.current) {
      const audio = new Audio('/sounds/notification.mp3')

      audio.play().catch(() => {
        // المتصفح قد يمنع الصوت في بعض الحالات
      })
    }

    previousUnreadCount.current = unreadCount
  }, [unreadCount])

  // إغلاق الإشعارات عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // الذهاب لإعدادات الحساب
  const handleProfileClick = () => {
    navigate('/admin/settings')
  }

  // فتح / إغلاق الإشعارات
  const handleNotificationsClick = () => {
    setNotificationsOpen((prev) => !prev)
  }

  // شكل الـ icon حسب نوع الإشعار
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={18} />

      case 'service':
        return <Wrench size={18} />

      default:
        return <Info size={18} />
    }
  }

  return (
    <header className="flex items-center gap-[16px] border-b border-line bg-panel px-[24px] py-[14px]">

      {/* Mobile Menu */}
      {onOpenSidebar ? (
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="فتح القائمة"
          className="rounded-[8px] p-[8px] text-text-400 transition hover:bg-card md:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      ) : null}

      {/* Search */}
      {showSearch ? (
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            onSearchSubmit?.(query)
          }}
          className="relative mx-auto w-full max-w-[420px]"
        >
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-text-300"
          />

          <input
            type="search"
            value={query}
            onChange={handleChange}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-[44px] w-full rounded-[10px] border border-line bg-card pr-[16px] pl-[44px] text-[15px] text-text-500 outline-none placeholder:text-text-200 transition focus:border-primary-400"
          />
        </form>
      ) : null}

      {/* Right Actions */}
      <div className="flex items-center gap-[12px]">

        {actions}

        {/* Notifications */}
        <div ref={notificationRef} className="relative">

          <button
            type="button"
            onClick={handleNotificationsClick}
            aria-label="الإشعارات"
            aria-expanded={notificationsOpen}
            className="group relative flex h-[40px] w-[40px] items-center justify-center rounded-[10px] text-text-400 transition-all duration-200 hover:bg-card hover:text-primary-500"
          >
            <Bell
              size={21}
              aria-hidden="true"
              className={`transition-transform duration-200 ${
                unreadCount > 0
                  ? 'animate-[wiggle_0.8s_ease-in-out]'
                  : ''
              }`}
            />

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute right-[1px] top-[-2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error-500 px-[4px] text-[10px] font-bold leading-none text-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute left-0 top-[50px] z-50 w-[360px] overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-[18px] py-[16px]">

                <div>
                  <h3 className="text-[18px] font-semibold text-text-500">
                    الإشعارات
                  </h3>

                  {unreadCount > 0 && (
                    <p className="mt-[3px] text-[12px] text-text-300">
                      لديك {unreadCount} إشعارات غير مقروءة
                    </p>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="flex items-center gap-[5px] rounded-[8px] px-[8px] py-[6px] text-[12px] font-medium text-primary-500 transition hover:bg-card"
                  >
                    <CheckCheck size={15} />
                    قراءة الكل
                  </button>
                )}
              </div>

              {/* Notifications List */}
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-[20px] py-[40px]">
                  <div className="mb-[12px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-card text-text-300">
                    <Bell size={24} />
                  </div>

                  <p className="text-[14px] font-medium text-text-400">
                    لا توجد إشعارات
                  </p>

                  <p className="mt-[4px] text-[12px] text-text-200">
                    ستظهر الإشعارات الجديدة هنا
                  </p>
                </div>
              ) : (
                <div className="max-h-[360px] overflow-y-auto">

                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`flex w-full gap-[12px] border-b border-line px-[18px] py-[14px] text-right transition hover:bg-card ${
                        !notification.read
                          ? 'bg-primary-50/40'
                          : 'bg-white'
                      }`}
                    >

                      {/* Icon */}
                      <div
                        className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${
                          !notification.read
                            ? 'bg-primary-100 text-primary-500'
                            : 'bg-card text-text-300'
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-[8px]">

                          <p
                            className={`text-[14px] ${
                              !notification.read
                                ? 'font-semibold text-text-500'
                                : 'font-medium text-text-400'
                            }`}
                          >
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-full bg-primary-500" />
                          )}

                        </div>

                        {notification.message && (
                          <p className="mt-[4px] line-clamp-2 text-[12px] leading-[20px] text-text-300">
                            {notification.message}
                          </p>
                        )}

                        {notification.time && (
                          <p className="mt-[5px] text-[11px] text-text-200">
                            {notification.time}
                          </p>
                        )}

                      </div>
                    </button>
                  ))}

                </div>
              )}

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-line p-[10px]">
                  <button
                    type="button"
                    className="w-full rounded-[8px] py-[8px] text-[13px] font-medium text-primary-500 transition hover:bg-card"
                  >
                    عرض كل الإشعارات
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* User Avatar */}
        {user?.avatar ? (
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="إعدادات الحساب"
            className="rounded-full outline-none transition-transform hover:scale-105 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          >
            <img
              src={user.avatar}
              alt={user.name ?? 'حساب المستخدم'}
              className="h-[40px] w-[40px] rounded-full border-2 border-primary-100 object-cover"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="إعدادات الحساب"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600"
          >
            {user?.name?.charAt(0) ?? 'A'}
          </button>
        )}

      </div>
    </header>
  )
}

export default AdminTopbar