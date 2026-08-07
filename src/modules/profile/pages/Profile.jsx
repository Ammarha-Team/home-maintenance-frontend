import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import {
  readDisplayName,
  readSession,
} from "../../auth/services/authSession.js";
import { AUTH_ROUTES } from "../../auth/constants/authRoutes.js";

// What this screen can show today, and why the rest is blank.
//
// The page used to open on a hardcoded person — "المستخدم", "user@email.com" —
// so it showed the same stranger to everyone who signed in. It now reads the
// signed-in session instead, which is the only source of user data the client
// has.
//
// That session carries an id, an email and the roles, and nothing else: the API
// exposes no profile endpoint at all, so there is nowhere to fetch a phone or an
// address from and nowhere to save one to. Those fields are therefore shown
// empty and left alone rather than filled with invented values, and the save
// button stays disabled instead of pretending to write somewhere.
//
// The name is read through `readDisplayName`, the same reader the home greeting
// and the technician portal use. It comes back empty until the login payload or
// the token carries a name — neither does today, though registration collects
// one.
const readProfileFromSession = (session) => ({
  name: readDisplayName(session),
  email: session?.user?.email ?? "",
  phone: "",
  governorate: "",
  city: "",
  address: "",
});

export default function Profile() {
  const session = readSession();
  const [profile, setProfile] = useState(() => readProfileFromSession(session));
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Reached signed out — there is no profile to show, so the page says so
  // rather than rendering an empty form that could never fill itself.
  if (!session?.token) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-6 text-center" dir="rtl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          الملف الشخصي
        </h1>
        <p className="text-gray-600 mb-6">
          سجّل الدخول لعرض بياناتك الشخصية.
        </p>
        <Link
          to={AUTH_ROUTES.login}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        الملف الشخصي
      </h1>

      {/* الصورة */}
      <div className="flex flex-col items-center mb-8">

        <div className="relative">

          {image ? (
            <img
              src={image}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-100">
              <Camera size={40} className="text-gray-400" />
            </div>
          )}

          <label className="absolute bottom-1 left-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
            <Camera className="text-white" size={18} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>

        </div>

        <p className="text-gray-500 mt-3 text-sm">
          اضغط على الأيقونة لتغيير الصورة
        </p>

      </div>

      {/* الفورم */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">

        <Input
          label="الاسم بالكامل"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="لم يصل الاسم من الخادم بعد"
        />

        <Input
          label="البريد الإلكتروني"
          name="email"
          value={profile.email}
          onChange={handleChange}
          readOnly
        />

        <Input
          label="رقم الهاتف"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <Input
          label="المحافظة"
          name="governorate"
          value={profile.governorate}
          onChange={handleChange}
        />

        <Input
          label="المدينة"
          name="city"
          value={profile.city}
          onChange={handleChange}
        />

        <Input
          label="العنوان"
          name="address"
          value={profile.address}
          onChange={handleChange}
        />

        <button
          type="button"
          disabled
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          حفظ التعديلات
        </button>

        <p className="text-center text-sm text-gray-500">
          حفظ التعديلات غير متاح حاليًا — لا يوفر الخادم خدمة لتحديث الملف
          الشخصي بعد.
        </p>

      </div>

    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 read-only:bg-gray-50 read-only:text-gray-600"
      />
    </div>
  );
}
