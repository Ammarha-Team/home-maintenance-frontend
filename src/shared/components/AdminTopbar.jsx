import { useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'

/**
 * The bar above a screen that sits inside an AdminSidebar layout: a search
 * field, a notification bell and the signed-in user. The menu button only
 * appears below `md`, where the sidebar is off-canvas and there is otherwise no
 * way to reach it.
 *
 * The search field works either way. Left alone it keeps its own text, which is
 * enough for a screen that filters as you type through `onSearchChange`; pass
 * `searchValue` as well and the caller owns it.
 *
 * @param {object}   props
 * @param {Function} [props.onOpenSidebar]  Shows the menu button when given.
 * @param {object}   [props.user]           `{ name, avatar }` of the signed-in
 *                                          user. The avatar is left out when
 *                                          there is none rather than guessed at.
 * @param {string}   [props.searchValue]    Makes the field controlled.
 * @param {Function} [props.onSearchChange] Called with the text on every edit.
 * @param {Function} [props.onSearchSubmit] Called with the text on submit.
 * @param {string}   [props.searchPlaceholder]
 * @param {boolean}  [props.showSearch]     Hide the field on screens with
 *                                          nothing to search.
 * @param {Function} [props.onNotifications] Shows the bell when given.
 * @param {node}     [props.actions]        Extra controls, before the avatar.
 */
function AdminTopbar({
  onOpenSidebar,
  user,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'البحث...',
  showSearch = true,
  onNotifications,
  actions,
}) {
  const [ownQuery, setOwnQuery] = useState('')
  const controlled = searchValue !== undefined
  const query = controlled ? searchValue : ownQuery

  const handleChange = (event) => {
    const next = event.target.value
    if (!controlled) setOwnQuery(next)
    onSearchChange?.(next)
  }

  return (
    <header className="flex items-center gap-[16px] border-b border-line bg-white px-[24px] py-[14px]">
      {onOpenSidebar ? (
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="فتح القائمة"
          className="rounded-[8px] p-[8px] text-text-400 hover:bg-card md:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      ) : null}

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
            className="h-[44px] w-full rounded-[10px] border border-line bg-card pr-[16px] pl-[44px] text-[15px] text-text-500 outline-none placeholder:text-text-200 focus:border-primary-400"
          />
        </form>
      ) : null}

      <div className="flex items-center gap-[12px]">
        {actions}

        {onNotifications ? (
          <button
            type="button"
            onClick={onNotifications}
            aria-label="الإشعارات"
            className="rounded-[8px] p-[8px] text-text-400 hover:bg-card"
          >
            <Bell size={20} aria-hidden="true" />
          </button>
        ) : null}

        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name ?? ''}
            className="h-[40px] w-[40px] rounded-full border-2 border-primary-100 object-cover"
          />
        ) : null}
      </div>
    </header>
  )
}

export default AdminTopbar
