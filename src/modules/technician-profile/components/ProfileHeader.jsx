import { useRef, useState } from "react";
import {
  Camera,
  Star,
  MapPin,
  Clock3,
  BriefcaseBusiness,
  User,
  WalletCards,
  Timer,
} from "lucide-react";

export default function ProfileHeader() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  return (
    <section
      dir="rtl"
      className="flex w-full flex-col gap-4 lg:flex-row mb-10"
    >
      {/* =====================================================
          كارت بيانات الفني
      ====================================================== */}
      <div className="order-1 flex min-h-[128px] flex-1 items-center rounded-xl border border-[#E6EAF0] bg-white px-6 py-4 shadow-sm">
        {/* الصورة - أقصى اليمين */}
        <div className="relative shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt="صورة الفني"
              className="h-[82px] w-[82px] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#F3F4F6]">
              <User
                size={38}
                strokeWidth={1.7}
                className="text-[#9CA3AF]"
              />
            </div>
          )}

          {/* اختيار الصورة */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-[-2px] left-[-2px] flex h-[31px] w-[31px] items-center justify-center rounded-full border-2 border-white bg-[#1769E0] text-white shadow-md transition hover:bg-[#1258C0]"
            aria-label="تغيير الصورة"
          >
            <Camera size={14} strokeWidth={2.5} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* =================================================
            معلومات الفني
        ================================================== */}
        <div className="mr-5 flex min-w-0 flex-1 flex-col justify-center">
          {/* الاسم + الحالات */}
          <div className="flex items-center justify-start gap-2">
            <h1 className="text-[20px] font-bold leading-7 text-[#222]">
              أحمد المنصور
            </h1>

            <span className="rounded-md bg-[#E8F7EC] px-2 py-[3px] text-[10px] font-semibold text-[#22A447]">
              ✓ موثق
            </span>

            <span className="rounded-md bg-[#EAF2FF] px-2 py-[3px] text-[10px] font-semibold text-[#3B82F6]">
              حساب احترافي
            </span>
          </div>

          {/* الوظيفة */}
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#777]">
            <BriefcaseBusiness size={14} />
            <span>فني تكييف وتبريد أول</span>
          </div>

          {/* البيانات */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 text-[11px] text-[#777]">
            {/* التقييم */}
            <div className="flex items-center gap-1">
              <Star
                size={13}
                className="fill-[#F59E0B] text-[#F59E0B]"
              />

              <span className="font-bold text-[#333]">
                4.9
              </span>

              <span>(120 تقييم)</span>
            </div>

            {/* المهام */}
            <div className="flex items-center gap-1.5">
              <BriefcaseBusiness size={13} />
              <span>+500 مهمة منجزة</span>
            </div>

            {/* الخبرة */}
            <div className="flex items-center gap-1.5">
              <Clock3 size={13} />
              <span>10 سنوات خبرة</span>
            </div>

            {/* المدينة */}
            <div className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>الرياض</span>
            </div>
          </div>
        </div>

        {/* =================================================
            الخط الفاصل
        ================================================== */}
        <div className="mx-7 hidden h-[78px] w-px bg-[#E5E7EB] lg:block" />

        {/* =================================================
            نسبة إكمال الطلبات - داخل كارت الفني
        ================================================== */}
        <div className="hidden w-[115px] shrink-0 flex-col items-center justify-center lg:flex">
          <div className="relative flex h-[58px] w-[58px] items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="absolute inset-0 h-full w-full -rotate-90"
            >
              {/* الدائرة الخلفية */}
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#EDF1F5"
                strokeWidth="5"
              />

              {/* النسبة */}
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#2563EB"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="163.36"
                strokeDashoffset="26.14"
              />
            </svg>

            <span className="text-[13px] font-bold text-[#2563EB]">
              84%
            </span>
          </div>

          <span className="mt-2 whitespace-nowrap text-[9px] text-[#777]">
            إكمال طلبات التطوير
          </span>
        </div>
      </div>

{/* =====================================================
    كارت أداء الشهر الحالي
====================================================== */}
<div className="order-2 w-full shrink-0 rounded-xl border border-[#E6EAF0] bg-white px-5 py-4 shadow-sm lg:w-[245px]">
  <h2 className="text-right text-[13px] font-bold text-[#333]">
    أداء الشهر الحالي
  </h2>

  <div className="mt-5 flex flex-col gap-4">

    {/* الأرباح */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF2FF]">
          <WalletCards
            size={14}
            strokeWidth={2}
            className="text-[#2563EB]"
          />
        </div>

        <span className="text-[10px] text-[#999]">
          الأرباح
        </span>
      </div>

      <span className="text-[11px] font-bold text-[#444]">
        4,250 ر.س
      </span>
    </div>

    {/* متوسط الاستجابة */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF2FF]">
          <Timer
            size={14}
            strokeWidth={2}
            className="text-[#2563EB]"
          />
        </div>

        <span className="text-[10px] text-[#999]">
          متوسط الاستجابة
        </span>
      </div>

      <span className="text-[11px] font-bold text-[#444]">
        12 دقيقة
      </span>
    </div>

  </div>
</div>
    </section>
  );
}