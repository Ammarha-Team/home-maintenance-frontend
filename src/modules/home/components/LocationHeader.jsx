import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { readDisplayName, readSession } from '../../auth/services/authSession.js';

export default function LocationHeader({ onRequestClick }) {
  const navigate = useNavigate();

  // The signed-in user's name, from the one place the session lives.
  //
  // This used to read a `user` key that nothing ever writes — signing in stores
  // the session under `ammarha.session` — so it always fell through to the
  // placeholder and greeted every customer as "the user".
  //
  // `readDisplayName` is the same reader the technician portal uses, so both
  // portals take the name from one source. It returns an empty string until the
  // API sends a name, and deliberately does not fall back to the email address:
  // greeting someone by the front of their address is a guess dressed as a fact.
  const userName = readDisplayName(readSession());

  return (
    <div className="w-full max-w-4xl mx-auto text-center my-6 px-4" dir="rtl">
      
      {/* 1. الترحيب الديناميكي بناءً على اسم المسجل */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center justify-center gap-2 mb-2">
        <span>{userName ? `مرحباً، ${userName}` : 'مرحباً بك'}</span>
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