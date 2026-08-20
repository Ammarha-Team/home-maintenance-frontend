/**
 * The service category a request is filed under.
 *
 * The options come from the API rather than from this file: the request body
 * carries a category id, and only the server knows which ids exist. The five
 * services the design lists are the five the API seeds, so the visible list is
 * unchanged — it is now the real one.
 *
 * @param {string} value the chosen category id, or "" for none
 * @param {(id: string) => void} onChange
 * @param {{id: string, label: string}[]} categories
 * @param {boolean} loading
 * @param {string|null} error a message when the list could not be loaded
 */
export default function ServiceSelector({
  value,
  onChange,
  categories = [],
  loading = false,
  error = null,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="service-category"
        className="block text-sm font-medium text-gray-700"
      >
        نوع الخدمة
      </label>

      <select
        id="service-category"
        value={value}
        disabled={loading || !!error}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-right text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {/* The placeholder doubles as the loading and failure state: a select
            with nothing in it reads as broken, and this says which it is. */}
        <option value="">
          {loading
            ? "جارٍ تحميل الخدمات..."
            : error
              ? "تعذر تحميل الخدمات"
              : "اختر الخدمة"}
        </option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
