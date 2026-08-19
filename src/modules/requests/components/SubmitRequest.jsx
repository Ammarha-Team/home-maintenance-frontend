import { Loader2 } from "lucide-react";

/**
 * The request's send button, and everything the send has to say back.
 *
 * The button reports its own progress rather than the page doing it elsewhere:
 * uploading photos can take a while, and a button that only greys out looks
 * stuck. `progress` is null while the size is unknown, which is why the
 * percentage is drawn only when there is one.
 *
 * @param {() => void} onSubmit
 * @param {boolean} submitting
 * @param {number|null} progress upload percentage, or null when unknown
 * @param {string|null} error a message from validation or from the server
 */
export default function SubmitRequest({
  onSubmit,
  submitting = false,
  progress = null,
  error = null,
}) {
  return (
    <div className="flex flex-col items-center gap-3 pt-10">

      {error && (
        <p
          role="alert"
          className="w-full max-w-md rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="
          flex
          w-full
          max-w-md
          items-center
          justify-center
          gap-2
          bg-blue-600
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:bg-blue-400
          text-white
          font-semibold
          py-4
          rounded-xl
          transition
          shadow-sm
        "
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}

        {submitting
          ? progress === null
            ? "جارٍ إرسال الطلب..."
            : `جارٍ إرسال الطلب... ${progress}%`
          : "إرسال الطلب"}
      </button>

    </div>
  );
}
