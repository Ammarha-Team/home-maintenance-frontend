import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEP_CLASS =
  'flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-line text-text-400 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-text-400'

// Beyond this many pages the strip collapses around the current one; up to it
// every page still gets its own button.
const FULL_STRIP_LIMIT = 7

/**
 * The pages to draw: both ends, the neighbourhood of the current page, and a
 * gap marker wherever a run was skipped.
 */
const pageStrip = (page, pageCount) => {
  if (pageCount <= FULL_STRIP_LIMIT) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const numbers = new Set([1, pageCount])
  for (let near = page - 1; near <= page + 1; near += 1) {
    if (near >= 1 && near <= pageCount) numbers.add(near)
  }

  const sorted = [...numbers].sort((left, right) => left - right)

  // A gap of exactly one page is drawn as that page rather than as an ellipsis
  // standing in for it, which would take the same room and say less.
  return sorted.flatMap((number, index) => {
    const previous = sorted[index - 1]
    if (previous === undefined || number - previous === 1) return [number]
    if (number - previous === 2) return [previous + 1, number]
    return [`gap-${number}`, number]
  })
}

/**
 * The bar under a table: how much of the list is on screen, and the way to the
 * rest of it.
 *
 * The arrows point the way the reader travels, not the way the numbers grow —
 * under RTL the previous page sits to the right, so that button carries the
 * right-facing chevron.
 */
function TablePagination({ page, pageCount, total, from, to, onChange, noun = 'فني' }) {
  const pages = pageStrip(page, pageCount)

  return (
    <div className="flex flex-wrap items-center justify-between gap-[16px] border-t border-line px-[20px] py-[16px]">
      <p className="text-[14px] text-text-300">
        عرض {from} إلى {to} من {total} {noun}
      </p>

      <nav aria-label="تنقل بين الصفحات">
        <ul className="flex items-center gap-[8px]">
          <li>
            <button
              type="button"
              onClick={() => onChange(page - 1)}
              disabled={page === 1}
              aria-label="الصفحة السابقة"
              className={STEP_CLASS}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </li>

          {pages.map((entry) =>
            typeof entry === 'string' ? (
              <li
                key={entry}
                aria-hidden="true"
                className="w-[24px] text-center text-[15px] text-text-300"
              >
                …
              </li>
            ) : (
              <li key={entry}>
                <button
                  type="button"
                  onClick={() => onChange(entry)}
                  aria-current={entry === page ? 'page' : undefined}
                  className={`h-[40px] w-[40px] rounded-[8px] text-[15px] transition-colors ${
                    entry === page
                      ? 'bg-primary-500 font-bold text-white'
                      : 'border border-line text-text-400 hover:border-primary-400 hover:text-primary-500'
                  }`}
                >
                  {entry}
                </button>
              </li>
            ),
          )}

          <li>
            <button
              type="button"
              onClick={() => onChange(page + 1)}
              disabled={page === pageCount}
              aria-label="الصفحة التالية"
              className={STEP_CLASS}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default TablePagination
