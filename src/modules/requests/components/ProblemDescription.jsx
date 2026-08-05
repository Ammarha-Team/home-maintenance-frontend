export default function ProblemDescription() {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        وصف المشكلة
      </label>

      <textarea
        rows={5}
        placeholder="اشرح المشكلة بالتفصيل لمساعدة الفني على فهم الحالة..."
        className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}