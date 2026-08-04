import { useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    // هنا هيكون استدعاء الـ API بعدين
    alert("تم تغيير كلمة المرور بنجاح");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10" dir="rtl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <LockKeyhole className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              تغيير كلمة المرور
            </h1>

            <p className="text-sm text-gray-500">
              أدخل كلمة المرور الحالية ثم الجديدة.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              كلمة المرور الحالية
            </label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              كلمة المرور الجديدة
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              تأكيد كلمة المرور
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
          >
            حفظ التغييرات
          </button>

        </form>
      </div>
    </div>
  );
}