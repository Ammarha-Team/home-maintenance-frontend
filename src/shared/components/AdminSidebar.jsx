import { Link, useLocation } from 'react-router-dom'

import logo from '../../assets/brand/logo.png'

/**
 * A fixed navigation rail, which under RTL sits against the right edge. It
 * stays put on desktop and slides in over the page below `md`, where 260px of
 * permanent navigation would leave the content no room.
 *
 * Everything it shows is passed in, so any section can mount its own: the
 * console uses it for the admin nav, but nothing here knows about the console.
 *
 * @param {object}   props
 * @param {Array}    props.items        `{ key, label, to, icon?, ready? }` per
 *                                      row. `icon` is a component, not a name.
 *                                      `ready` defaults to true; a false one is
 *                                      drawn but not linked.
 * @param {string}   [props.homeTo]     Where the logo links. Defaults to `/`.
 * @param {string}   [props.subtitle]   Small line under the logo.
 * @param {node}     [props.footer]     Pinned to the bottom, below the nav.
 * @param {boolean}  [props.open]       Whether it is showing below `md`.
 * @param {Function} [props.onNavigate] Fires on any row, to close it again.
 * @param {string}   [props.label]      Accessible name for the nav landmark.
 */
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

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 flex w-[260px] flex-col border-l border-line bg-white transition-transform md:translate-x-0 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="border-b border-line px-[24px] py-[20px]">
        <Link to={homeTo} onClick={onNavigate} className="block">
          <img src={logo} alt="عمّرها" className="h-[40px] w-auto" />
        </Link>
        {subtitle ? (
          <p className="mt-[10px] text-[14px] leading-[20px] text-text-300">
            {subtitle}
          </p>
        ) : null}
      </div>

      <nav aria-label={label} className="flex-1 overflow-y-auto py-[16px]">
        <ul>
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.to

            // An unbuilt screen is drawn but not linked: a <Link> to a path no
            // route answers falls through to the catch-all and throws the
            // visitor back out to the landing page.
            if (item.ready === false) {
              return (
                <li key={item.key}>
                  <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-text-200">
                    {Icon ? <Icon size={20} aria-hidden="true" /> : null}
                    {item.label}
                  </span>
                </li>
              )
            }

            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] transition-colors ${
                    active
                      ? 'border-r-[3px] border-primary-500 bg-primary-50 font-bold text-primary-500'
                      : 'text-text-400 hover:bg-card hover:text-primary-500'
                  }`}
                >
                  {Icon ? <Icon size={20} aria-hidden="true" /> : null}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {footer ? (
        <div className="border-t border-line py-[12px]">{footer}</div>
      ) : null}
    </aside>
  )
}

export default AdminSidebar
