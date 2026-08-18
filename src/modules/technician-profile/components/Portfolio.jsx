import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { useToast } from "../../../shared/toast/toastContext.js";
import { ACCEPTED_IMAGE_ATTR } from "../services/technicianProfileService";

export default function Portfolio({ items, upload, onAddImages }) {
  const { showToast } = useToast();

  const handleSelect = async (event) => {
    const files = Array.from(event.target.files ?? []);

    // Cleared first so re-picking the same files fires the input again.
    event.target.value = "";

    if (files.length === 0) return;

    const { added, failed } = await onAddImages(files);

    // Each image is its own request, so a selection can half-succeed. The
    // message says which half rather than rounding to "done" or "failed".
    if (added > 0) {
      showToast({
        message: failed
          ? `تم رفع ${added} من ${added + failed} صور.`
          : `تم رفع ${added} ${added === 1 ? "صورة" : "صور"} بنجاح.`,
        variant: failed ? "error" : "success",
      });
    } else {
      showToast({
        message: `تعذر رفع ${failed === 1 ? "الصورة" : "الصور"}.`,
        variant: "error",
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="
        w-full max-w-[995px]
        mr-0 ml-auto
        rounded-2xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        mb-10 mt-10
      "
    >
      {/* Header */}
      <div className="text-right">
        <h2 className="text-xl font-bold text-gray-800">
          معرض الأعمال
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          وثق أعمالك السابقة تزيد من ثقة العملاء بنسبة 40%.
        </p>
      </div>

      {upload.error && (
        <p className="mt-3 text-right text-[13px] font-semibold text-[#B42318]">
          {upload.error}
        </p>
      )}

      {/* Gallery */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              group relative
              h-[210px]
              overflow-hidden
              rounded-xl
            "
          >
            <img
              src={item.imageUrl}
              alt={item.title || "عمل سابق"}
              className="
                h-full w-full
                object-cover
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

            {/*
              Delete Button — the API has no endpoint for removing a portfolio
              item, so the control stays visible but inert rather than
              pretending to work.
            */}
            <button
              type="button"
              aria-label="حذف الصورة"
              title="حذف الصور غير متاح حاليًا"
              disabled
              className="
                absolute left-3 top-3
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-red-500
                text-white
                opacity-0
                shadow-md
                transition-all
                duration-200
                cursor-not-allowed
                group-hover:opacity-60
              "
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {/* الصور قيد الرفع — معاينة محلية حتى يرد الخادم */}
        {upload.pending.map((item) => (
          <div
            key={item.key}
            className="relative h-[210px] overflow-hidden rounded-xl"
          >
            <img
              src={item.url}
              alt={item.name}
              className="h-full w-full object-cover opacity-60"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 text-white">
              <Loader2 size={22} className="animate-spin" />

              {upload.percent !== null && (
                <span className="text-[11px] font-semibold">
                  {upload.percent}%
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Upload */}
        <label
          className={`
            flex h-[210px]
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            border-gray-300
            bg-gray-50
            text-center
            transition-all
            duration-200
            ${
              upload.busy
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:border-blue-500 hover:bg-gray-100"
            }
          `}
        >
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-blue-50
              text-blue-500
            "
          >
            {upload.busy ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <span className="mt-3 text-sm font-semibold text-gray-700">
            {upload.busy ? "جارٍ رفع الصور..." : "اسحب وأفلت الصور هنا"}
          </span>

          <span className="mt-1 text-xs text-gray-400">
            {upload.busy && upload.percent !== null
              ? `${upload.percent}%`
              : "أو انقر للاستعراض (Max 5MB)"}
          </span>

          {/* Nested in the label, so the whole dropzone opens the dialog. */}
          <input
            type="file"
            accept={ACCEPTED_IMAGE_ATTR}
            multiple
            disabled={upload.busy}
            onChange={handleSelect}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
