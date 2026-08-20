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
    /* `space-y-2` and no bottom margin: the form body already spaces its
       sections, and the extra margin here left this one field sitting further
       from the next than any other. The radius matches the other fields. */
    <div className="space-y-2">
      <label
        htmlFor="problem-description"
        className="block text-sm font-medium text-gray-700"
      >
        وصف المشكلة
      </label>

      <textarea
        id="problem-description"
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="اشرح المشكلة بالتفصيل لمساعدة الفني على فهم الحالة..."
        className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-right text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
