import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LocationHeader({ onRequestClick }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('المستخدم'); // قيمة افتراضية

  useEffect(() => {
    // جلب اسم المستخدم من بيانات التسجيل (تعديل المفتاح حسب المعتاد في مشروعكم مثل user أو userData)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          // جلب الاسم الأول فقط ليكون أنيقاً مع الترحيب
          const firstName = parsedUser.name.split(' ')[0];
          setUserName(firstName);
        }
      } catch (e) {
        // لو الـ storedUser عبارة عن نص عادي
        setUserName(storedUser);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto text-center my-6 px-4" dir="rtl">
      
      {/* 1. الترحيب الديناميكي بناءً على اسم المسجل */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center justify-center gap-2 mb-2">
        <span>مرحباً، {userName}</span>
        <span className="text-2xl">👋</span>
      </h1>
      
      {/* 2. الوصف التحفيزي */}
      <p className="text-gray-600 text-sm md:text-base mb-6">
        كل ما يحتاجه منزلك من صيانة وتجهيز في مكان واحد وبأعلى جودة.
      </p>

      {/* 3. زر الحجز على اليمين وشريط البحث على اليسار تماماً مثل التصميم */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        
        {/* زر احجز خدمة الآن (على اليمين) */}


        {/* شريط البحث (على اليسار) مع أيقونة البحث */}
        <div className="relative w-full sm:flex-1 order-2 sm:order-none">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="ما الذي تريد صيانتته اليوم؟"
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-right"
          />
        </div>

        <button
          onClick={onRequestClick}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm whitespace-nowrap order-1 sm:order-none"
        >
          <span>احجز خدمة الآن</span>
        </button>
      </div>

    </div>
  );
}