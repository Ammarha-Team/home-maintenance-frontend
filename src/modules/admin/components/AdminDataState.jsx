import { LoaderCircle, RotateCcw, TriangleAlert } from 'lucide-react'

/**
 * What a console screen shows while its data is still coming, or after it did
 * not come at all.
 *
 * Written against the theme tokens the rest of the console uses — `bg-panel`,
 * `border-line`, `text-text-*` — so it follows the light and dark palettes
 * without a second set of colours here.
 *
 * The failure branch says what the API said. The shared client already turns
 * every backend shape into an `Error` carrying a readable Arabic message, so
 * there is nothing to translate at this end; an error that somehow arrives
 * without one falls back to a general line rather than printing "undefined".
 */
function AdminDataState({ loading, error, onRetry, label = 'جاري تحميل البيانات...' }) {
  if (loading) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-[12px] rounded-[12px] border border-line bg-panel px-[24px] py-[48px] shadow-card"
      >
        <LoaderCircle size={28} aria-hidden="true" className="animate-spin text-primary-500" />

        <p className="text-[15px] text-text-300">{label}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section
        role="alert"
        className="flex flex-col items-center justify-center gap-[12px] rounded-[12px] border border-line bg-panel px-[24px] py-[48px] shadow-card"
      >
        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-error-50 text-error-500">
          <TriangleAlert size={22} aria-hidden="true" />
        </span>

        <p className="text-center text-[15px] text-text-400">
          {error.message || 'تعذر تحميل البيانات. حاول مرة أخرى.'}
        </p>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="flex h-[42px] items-center gap-[8px] rounded-[10px] bg-primary-500 px-[20px] text-[14px] font-bold text-white transition-colors hover:bg-primary-600"
          >
            <RotateCcw size={16} aria-hidden="true" />
            إعادة المحاولة
          </button>
        ) : null}
      </section>
    )
  }

  return null
}

export default AdminDataState
