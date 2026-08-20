import { UploadCloud, X } from "lucide-react";

import {
  ACCEPTED_IMAGE_ATTR,
  MAX_IMAGE_COUNT,
  validateImageFile,
} from "../services/serviceRequestService";

/**
 * The photos that travel with a request.
 *
 * Optional throughout — a request without a picture is a valid request — so a
 * rejected file is skipped rather than failing the whole selection. The
 * picker's `accept` filter is a convenience, not a control, so every file is
 * checked again in `validateImageFile`.
 *
 * @param {File[]} value
 * @param {(files: File[]) => void} onChange
 */
export default function UploadImages({ value = [], onChange }) {
  const addFiles = (event) => {
    const picked = Array.from(event.target.files ?? []);

    // The same input can be used twice, so new files join the ones already
    // chosen instead of replacing them.
    const room = MAX_IMAGE_COUNT - value.length;
    const accepted = picked.filter((file) => !validateImageFile(file));

    onChange([...value, ...accepted.slice(0, Math.max(room, 0))]);

    // Clearing the input lets the same file be chosen again after it was
    // removed — the browser fires no change event for an unchanged value.
    event.target.value = "";
  };

  const removeAt = (index) =>
    onChange(value.filter((_, position) => position !== index));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        صور المشكلة (اختياري)
      </label>

      <label
        htmlFor="images"
        className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 sm:h-48"
      >
        <UploadCloud
          size={36}
          aria-hidden="true"
          className="mb-2 text-blue-600"
        />

        <p className="font-medium text-gray-700">اضغط لرفع الصور</p>

        <p className="mt-1 text-sm text-gray-400">PNG • JPG • JPEG</p>

        <input
          id="images"
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_ATTR}
          onChange={addFiles}
          className="hidden"
        />
      </label>

      {/* Only drawn once something is chosen, so an untouched form looks
          exactly as it did before. */}
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-gray-700"
            >
              <span className="max-w-[12rem] truncate">{file.name}</span>

              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`إزالة ${file.name}`}
                className="text-gray-400 transition hover:text-red-600"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
