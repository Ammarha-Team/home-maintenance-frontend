/**
 * The customer's own account of the problem — the request's only free text.
 *
 * Controlled, because the form above is what sends it.
 *
 * @param {string} value
 * @param {(text: string) => void} onChange
 */
export default function ProblemDescription({ value, onChange }) {
  return (
    <div className="mb-6">
      <label
        htmlFor="problem-description"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        وصف المشكلة
      </label>

      <textarea
        id="problem-description"
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="اشرح المشكلة بالتفصيل لمساعدة الفني على فهم الحالة..."
        className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
