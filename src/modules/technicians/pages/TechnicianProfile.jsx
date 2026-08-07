import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Wrench,
  MapPin,
  Banknote,
  MessageSquare,
  Plus,
  Image as ImageIcon,
  Phone,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";

export default function TechnicianProfile() {
  const { id: _id } = useParams();

  const handleAcceptOrder = () => {
    alert("تم قبول طلب الخدمة من الفني بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-cairo" dir="rtl">
      {/* 1. النافبار */}
      <UserNavbar />

      {/* 2. محتوى الصفحة الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* البريدكرامب البروفيشنال المظبوط بنفس توجه الصفحات الموضحة في السكرين */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs sm:text-sm text-gray-400 mb-6 flex items-center gap-2 font-medium flex-wrap"
        >
          <Link to="/home" className="hover:text-[#2563eb] transition-colors">
            الرئيسيه
          </Link>
          <span className="text-gray-300">&gt;</span>
          <Link to="/my-orders" className="hover:text-[#2563eb] transition-colors">
            طلباتي
          </Link>
          <span className="text-gray-300">&gt;</span>
          <Link to="/my-orders/1" className="hover:text-[#2563eb] transition-colors">
            عرض العروض المتقدمه
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-[#2563eb] font-semibold">تفاصيل الفني</span>
        </nav>

        {/* الشبكة الرئيسية للتصميم (Responsive Layout Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* العمود الأيمن (تفاصيل الفني الرئيسية) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Map Card (matches screenshot) */}
           
            {/* Card 1: هيدر الفني الرئيسي */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs text-center flex flex-col items-center relative">
              {/* Avatar Photo with Green Status Badge */}
              <div className="relative mb-3">
                <img
                  src="/technician_avatar.jpg"
                  alt="أحمد العتيبي"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="absolute bottom-1 right-1 bg-[#10b981] text-white text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  موثوق
                </span>
              </div>

              {/* Name & Experience Badge */}
              <div className="flex items-center gap-2 flex-wrap justify-center mb-1">
                <h1 className="font-bold text-gray-900 text-xl sm:text-2xl">
                  أحمد العتيبي
                </h1>
                <span className="bg-blue-50 text-[#2563eb] text-xs font-semibold px-3 py-1 rounded-lg">
                  17 سنه من الخبره
                </span>
              </div>

              {/* Role Subtitle */}
              <p className="text-gray-400 text-xs sm:text-sm font-medium mb-3">
                اخصائي تمديدات كهربائية وأنظمة ذكية
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex items-center text-amber-400 gap-0.5">
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                </div>
                <span className="font-bold text-gray-900 text-sm">4.8</span>
                <span className="text-[#2563eb] text-xs font-medium">
                  (126 تقييم)
                </span>
              </div>

              {/* Specialization Chips */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["كهرباء", "أنظمة إنذار", "صيانة دورية"].map((chip, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100/80 text-gray-600 text-xs px-3.5 py-1.5 rounded-lg font-medium"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: عن أحمد العتيبي */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-2xs text-right">
              <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 mb-3">
                <Wrench size={18} className="text-gray-700" />
                <span>عن احمد العتيبي</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                خبير فني متخصص في التمديدات الكهربائية بخبرة تتجاوز العقود. أركز على تقديم حلول مستدامة وآمنة للمنازل العصرية، مع تخصص دقيق في تركيب أنظمة المنازل الذكية وتوزيع الإضاءة المعمارية. ملتزم بالدقة في المواعيد واتباع أعلى معايير السلامة المهنية. هدفنا دائماً هو تحويل منزلك إلى مساحة آمنة ومريحة باستخدام أحدث التقنيات.
              </p>
            </div>

            {/* Card 3: صور الأعمال السابقة */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-2xs text-right">
              <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 mb-4">
                <ImageIcon size={18} className="text-gray-700" />
                <span>صور الاعمال السابقة</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <img
                  src="/gallery/lighting.jpg"
                  alt="عمل سابق 1"
                  className="w-full h-36 sm:h-44 object-cover rounded-xl border border-gray-100 hover:opacity-95 transition-opacity shadow-2xs"
                />
                <img
                  src="/gallery/electrical_panel.jpg"
                  alt="عمل سابق 2"
                  className="w-full h-36 sm:h-44 object-cover rounded-xl border border-gray-100 hover:opacity-95 transition-opacity shadow-2xs"
                />
                <img
                  src="/gallery/patio.jpg"
                  alt="عمل سابق 3"
                  className="w-full h-36 sm:h-44 object-cover rounded-xl border border-gray-100 hover:opacity-95 transition-opacity shadow-2xs"
                />
                <img
                  src="/gallery/smart_home.jpg"
                  alt="عمل سابق 4"
                  className="w-full h-36 sm:h-44 object-cover rounded-xl border border-gray-100 hover:opacity-95 transition-opacity shadow-2xs"
                />

                {/* Overlaid 5th photo with +13 images counter */}
                <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden group cursor-pointer border border-gray-100 shadow-2xs">
                  <img
                    src="/gallery/smart_home.jpg"
                    alt="أعمال إضافية"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm sm:text-base gap-1">
                    <Plus size={16} />
                    <span>13 صورة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: التعليقات */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-2xs text-right">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-700" />
                  <span>التعليقات</span>
                </h2>
                <button
                  type="button"
                  className="text-[#2563eb] text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
                >
                  مشاهدة الكل
                </button>
              </div>

              <div className="space-y-4">
                {/* Review 1 */}
                <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100 text-right">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563eb] font-bold text-sm flex items-center justify-center">
                        س
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        سارة الشمري
                      </span>
                    </div>
                    <div className="flex text-amber-400 gap-0.5">
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-1.5">
                    فني ممتاز ومحترف جداً، قام بإصلاح عطل الكهرباء بسرعة وفي وقت قياسي. أنصح بالتعامل معه بشدة.
                  </p>
                  <span className="text-[11px] text-gray-400 block text-left">
                    منذ يومين
                  </span>
                </div>

                {/* Review 2 */}
                <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100 text-right">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563eb] font-bold text-sm flex items-center justify-center">
                        ف
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        فهد العتيبي
                      </span>
                    </div>
                    <div className="flex text-amber-400 gap-0.5">
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="fill-amber-400" />
                      <Star size={13} className="text-gray-300" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-1.5">
                    دقة في المواعيد وسعر مناسب مقارنة بجودة العمل، قام بتركيب نظام المنزل الذكي ببراعة.
                  </p>
                  <span className="text-[11px] text-gray-400 block text-left">
                    منذ أسبوع
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيسر (السيدبار الجانبي) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* كارت نطاق العمل وسعر الفحص */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs text-right space-y-4">
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm">
                  <MapPin size={16} className="text-gray-500" />
                  <span>نطاق العمل</span>
                </div>
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                  الشيخ زايد
                </span>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm">
                  <Banknote size={16} className="text-gray-500" />
                  <span>سعر الفحص</span>
                </div>
                <span className="font-bold text-gray-900 text-xs sm:text-sm">
                  100 جنيه مصري
                </span>
              </div>
            </div>

            {/* كارت قبول طلب الخدمة */}
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 shadow-2xs text-center space-y-3">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                هل تريد قبول طلب الخدمه من الفني؟
              </h3>
              <button
                type="button"
                onClick={handleAcceptOrder}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
              >
                قبول الطلب
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. الفوتر */}
      <Footer />
    </div>
  );
}
