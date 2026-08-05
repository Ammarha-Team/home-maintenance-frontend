import { useState } from "react";
import { Camera } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "المستخدم",
    email: "user@email.com",
    phone: "",
    governorate: "",
    city: "",
    address: "",
  });

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
        />

        <Input
          label="البريد الإلكتروني"
          name="email"
          value={profile.email}
          onChange={handleChange}
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

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
          حفظ التعديلات
        </button>

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
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}