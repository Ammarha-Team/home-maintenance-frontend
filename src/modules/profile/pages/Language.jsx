import { useState } from "react";

export default function Language() {
  const [language, setLanguage] = useState("ar");

  return (
    <div className="max-w-xl mx-auto py-10 px-6" dir="rtl">

      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        اللغة
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-5">

        <label className="flex justify-between items-center cursor-pointer">
          العربية
          <input
            type="radio"
            checked={language === "ar"}
            onChange={() => setLanguage("ar")}
          />
        </label>

        <label className="flex justify-between items-center cursor-pointer">
          English
          <input
            type="radio"
            checked={language === "en"}
            onChange={() => setLanguage("en")}
          />
        </label>

      </div>
    </div>
  );
}