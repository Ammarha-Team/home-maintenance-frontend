import { AlertCircle, Loader2, MapPin } from "lucide-react";

import MapPicker from "./MapPicker";

// The value the dropdown carries when the customer wants to drop a fresh pin
// rather than reuse something. An empty string would collide with "nothing
// chosen yet", so the intent gets a name of its own.
export const NEW_ADDRESS = "new";

/**
 * Where the service is needed: an address the customer saved before, or a new
 * point on the map.
 *
 * Picking a saved one sends its id and nothing else, which is what keeps the
 * address book from growing a near-duplicate row on every request. A new point
 * still has to be described in full, and — for now — still has to be saved;
 * the note under the toggle says so rather than letting the checkbox imply
 * otherwise.
 *
 * @param {{mode: string, savedId: string, save: boolean, title: string}} value
 * @param {(patch: object) => void} onChange receives just the field that moved
 * @param {{lat: number, lng: number}|null} location the pin, owned by the form
 * @param {(next: {lat: number, lng: number}) => void} onLocationChange
 * @param {Array<{id: string, label: string}>} addresses
 */
export default function AddressSelector({
  value,
  onChange,
  location,
  onLocationChange,
  addresses,
  loading,
  error,
  onRetry,
}) {
  const { mode, savedId, save, title } = value;
  const usingSaved = mode !== NEW_ADDRESS;

  // Nothing saved yet is the ordinary state for a first request, and there is
  // no choice to offer in it — the map is the only way forward, so the dropdown
  // stands down rather than showing a list of one option.
  const hasChoice = addresses.length > 0;

  const handleSelect = (event) => {
    const next = event.target.value;

    onChange(
      next === NEW_ADDRESS
        ? { mode: NEW_ADDRESS, savedId: "" }
        : { mode: "saved", savedId: next },
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-right">
        <h3 className="text-lg font-bold text-gray-800">عنوان الخدمة</h3>

        <p className="mt-1 text-sm text-gray-500">
          اختر عنوانًا محفوظًا أو حدد موقعًا جديدًا على الخريطة
        </p>
      </div>

      {loading ? (
        <p className="flex items-center justify-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          جارٍ تحميل عناوينك المحفوظة...
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        </p>
      ) : error ? (
        // The saved list failing does not block the request: the map still
        // works, so the form stays usable and only the shortcut is missing.
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            إعادة المحاولة
          </button>

          <span className="flex items-center gap-2">
            تعذر تحميل العناوين المحفوظة. يمكنك تحديد الموقع على الخريطة.
            <AlertCircle size={16} aria-hidden="true" className="shrink-0" />
          </span>
        </div>
      ) : hasChoice ? (
        <div className="space-y-2 text-right">
          <label
            htmlFor="service-address"
            className="block text-sm font-medium text-gray-700"
          >
            العنوان
          </label>

          {/* Same shape as the service-category select above it — both are the
              form's own dropdowns and had drifted to different radii, fills
              and focus treatments. */}
          <select
            id="service-address"
            value={usingSaved ? savedId : NEW_ADDRESS}
            onChange={handleSelect}
            className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-right text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              اختر عنوانًا محفوظًا
            </option>

            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.label}
              </option>
            ))}

            <option value={NEW_ADDRESS}>عنوان جديد على الخريطة</option>
          </select>
        </div>
      ) : (
        <p className="flex items-center justify-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          لا توجد عناوين محفوظة بعد. حدد موقع الخدمة على الخريطة.
          <MapPin size={16} aria-hidden="true" className="shrink-0" />
        </p>
      )}

      {/* The map is drawn only when a new point is actually being chosen.
          Leaving it up under a saved address would invite the customer to move
          a pin the request is not going to send. */}
      {usingSaved && hasChoice ? null : (
        <div className="space-y-4">
          <MapPicker value={location} onChange={onLocationChange} />

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center justify-end gap-3 text-sm font-semibold text-gray-800">
              احفظ هذا العنوان للطلبات القادمة
              <input
                type="checkbox"
                checked={save}
                onChange={(event) => onChange({ save: event.target.checked })}
                className="size-4 cursor-pointer accent-blue-600"
              />
            </label>

            {save ? (
              <div className="space-y-2 text-right">
                <label
                  htmlFor="address-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  اسم العنوان
                </label>

                <input
                  id="address-title"
                  type="text"
                  value={title}
                  onChange={(event) => onChange({ title: event.target.value })}
                  placeholder="المنزل، العمل، ..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-right text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <p className="text-xs text-gray-500">
                  اسم واضح يساعدك على تمييز العنوان في طلباتك القادمة.
                </p>
              </div>
            ) : (
              // Honest rather than silent: the server cannot yet read back a
              // request whose address was not stored, so it is stored anyway.
              // Saying so beats letting the customer believe otherwise.
              <p className="flex items-start justify-end gap-2 text-right text-xs text-gray-500">
                سيتم حفظ هذا العنوان مؤقتًا على أي حال لأسباب فنية، ولن يظهر
                باسم مميز في قائمتك.
                <AlertCircle
                  size={14}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
