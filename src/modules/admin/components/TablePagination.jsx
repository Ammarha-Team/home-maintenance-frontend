import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEP_CLASS =
  'flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-line text-text-400 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-text-400'

/**
 * The bar under a table: how much of the list is on screen, and the way to the
 * rest of it.
 *
 * The arrows point the way the reader travels, not the way the numbers grow —
 * under RTL the previous page sits to the right, so that button carries the
 * right-facing chevron.
 */
function TablePagination({ page, pageCount, total, from, to, onChange }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-[16px] border-t border-line px-[20px] py-[16px]">
      <p className="text-[14px] text-text-300">
        عرض {from} إلى {to} من {total} فني
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

          {pages.map((number) => (
            <li key={number}>
              <button
                type="button"
                onClick={() => onChange(number)}
                aria-current={number === page ? 'page' : undefined}
                className={`h-[40px] w-[40px] rounded-[8px] text-[15px] transition-colors ${
                  number === page
                    ? 'bg-primary-500 font-bold text-white'
                    : 'border border-line text-text-400 hover:border-primary-400 hover:text-primary-500'
                }`}
              >
                {number}
              </button>
            </li>
          ))}

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
