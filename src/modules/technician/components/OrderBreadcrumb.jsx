import { Fragment } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * The trail above the order screens (Figma node 21:2612).
 *
 * The frame writes it right to left — الرئيسيه ‹ الطلبات ‹ تفاصيل الطلب — with
 * the current page last and not a link. `trail` arrives in that reading order,
 * and the last entry renders as plain text: a link to the page you are already
 * on is only noise for anyone tabbing through.
 *
 * The separators are decorative, so `aria-hidden` keeps a screen reader from
 * announcing an arrow between every crumb.
 */
function OrderBreadcrumb({ trail }) {
  return (
    <nav aria-label="مسار التنقل">
      <ol className="flex flex-wrap items-center gap-[4px] text-[16px] leading-[1.5] md:text-[20px]">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1

          return (
            <Fragment key={crumb.label}>
              {index > 0 ? (
                <ChevronLeft
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-text-200"
                />
              ) : null}

              <li>
                {last ? (
                  <span aria-current="page" className="text-primary-500">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="text-text-200 underline-offset-4 transition-colors hover:text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default OrderBreadcrumb
