

export default function ServiceSelector() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        نوع الخدمة
      </label>

      <select className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">اختر الخدمة</option>
        <option>سباكة</option>
        <option>كهرباء</option>
        <option>تكييف</option>
        <option>نجارة</option>
        <option>دهانات</option>
      </select>
    </div>
  );
}