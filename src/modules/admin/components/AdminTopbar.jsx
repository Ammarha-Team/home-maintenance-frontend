import { useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'

/**
 * The bar above every console screen: a search field, the notification bell and
 * the signed-in admin. The menu button only appears below `md`, where the
 * sidebar is off-canvas and there is otherwise no way to reach it.
 */
function AdminTopbar({ onOpenSidebar }) {
  const [query, setQuery] = useState('')

  return (
    <header className="flex items-center gap-[16px] border-b border-line bg-white px-[24px] py-[14px]">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="فتح القائمة"
        className="rounded-[8px] p-[8px] text-text-400 hover:bg-card md:hidden"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="relative mx-auto w-full max-w-[420px]">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-text-300"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="البحث..."
          aria-label="البحث"
          className="h-[44px] w-full rounded-[10px] border border-line bg-card pr-[16px] pl-[44px] text-[15px] text-text-500 outline-none placeholder:text-text-200 focus:border-primary-400"
        />
      </div>

      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          aria-label="الإشعارات"
          className="rounded-[8px] p-[8px] text-text-400 hover:bg-card"
        >
          <Bell size={20} aria-hidden="true" />
        </button>
        <img
          src="/technician_avatar.jpg"
          alt="احمد حمدي"
          className="h-[40px] w-[40px] rounded-full border-2 border-primary-100 object-cover"
        />
      </div>
    </header>
  )
}

export default AdminTopbar
