import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Check,
  Navigation,
  MessageCircle,
  Phone,
  X,
  Star,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import { useToast } from "../../../shared/toast/toastContext.js";

// كم تستغرق الزيارة قبل أن يبلغ الفني بانتهائها. هذه محاكاة للحالة التي
// سيرسلها الخادم لاحقاً، وضعت في مكان واحد ليسهل استبدالها به.
const SERVICE_COMPLETION_DELAY = 6000;

// تخصيص ماركر الخريطة ليبدو أنيقاً وبدون مشاكل المسارات الافتراضية في Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function OrderTracking() {
  const { id = "4920" } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showCancelModal, setShowCancelModal] = useState(false);

  // مسار الطلب على هذه الشاشة: جارٍ التنفيذ ← اكتملت الخدمة ← أو ملغي
  const [status, setStatus] = useState("in_progress");

  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";

  // وصول الفني وانتهاء عمله يصل من الخادم لاحقاً؛ حتى ذلك الحين تتقدم الشاشة
  // بنفسها حتى لا تقف رحلة العميل عند التتبع.
  useEffect(() => {
    if (status !== "in_progress") return undefined;

    const timer = setTimeout(() => {
      setStatus("completed");
      showToast({ message: "اكتملت الخدمة، بانتظار تأكيدك وتقييمك للفني" });
    }, SERVICE_COMPLETION_DELAY);

    return () => clearTimeout(timer);
  }, [status, showToast]);

  // إحداثيات مركز الرياض (حي النخيل - KAFD كما بالصورة)
  const position = [24.7556, 46.6389];

  const handleConfirmCancel = () => {
    setStatus("cancelled");
    setShowCancelModal(false);
    showToast({ message: `تم إلغاء الطلب #${id}`, variant: "error" });
  };

  // تأكيد الاستلام ينقل العميل إلى تقييم الفني: آخر خطوة في الرحلة
  const handleConfirmCompletion = () => navigate(`/my-orders/${id}/review`);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      {/* 1. النافبار */}
      <UserNavbar />

      {/* 2. محتوى الصفحة الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* البريدكرامب (Breadcrumb Navigation) */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs sm:text-sm text-gray-400 mb-6 flex items-center gap-2 font-medium"
        >
          <Link to="/home" className="hover:text-[#2563eb] transition-colors">
            الرئيسية
          </Link>
          <span className="text-gray-300">&gt;</span>
          <Link to="/my-orders" className="hover:text-[#2563eb] transition-colors">
            طلباتي
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-[#2563eb] font-semibold">تتبع الطلب</span>
        </nav>

        {/* عنوان الصفحة */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-right">
          تتبع الطلب
        </h1>

        {/* الشبكة الرئيسية (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* العمود الأيمن (4 أعمدة): كارت تايم لاين حالة الطلب + زر إلغاء الطلب */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 order-1 lg:order-1">
            {/* كارت تايم لاين حالة الطلب */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs text-right">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-50">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    isCancelled
                      ? "bg-rose-50 text-rose-600"
                      : isCompleted
                        ? "bg-[#e6f7ed] text-[#059669]"
                        : "bg-blue-50 text-[#2563eb]"
                  }`}
                >
                  {isCancelled ? "ملغي" : isCompleted ? "مكتمل" : "مباشر"}
                </span>
                <h2 className="font-bold text-gray-900 text-lg">
                  حالة الطلب #{id}
                </h2>
              </div>

              {/* RTL Vertical Stepper Timeline */}
              <div className="relative pr-6 space-y-7">
                {/* الخط الرأسي الخلفي */}
                <div className="absolute right-3 top-2.5 bottom-2.5 w-0.5 bg-gray-200"></div>

                {/* الخطوة 1: تم استلام الطلب */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -right-6 top-0.5 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center ring-4 ring-white shadow-2xs z-10">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <div className="mr-2">
                    <h3 className="font-bold text-[#2563eb] text-sm sm:text-base">
                      تم استلام الطلب
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 font-medium">
                      10:30 صباحاً
                    </p>
                  </div>
                </div>

                {/* الخطوة 2: الفني في الطريق */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -right-6 top-0.5 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center ring-4 ring-white shadow-2xs z-10">
                    <Navigation size={13} className="fill-white text-white" />
                  </div>
                  <div className="mr-2">
                    <h3 className="font-bold text-[#2563eb] text-sm sm:text-base">
                      الفني في الطريق
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5 font-medium">
                      الوصول المتوقع: 5 دقائق
                    </p>
                  </div>
                </div>

                {/* الخطوة 3: اكتملت الخدمة */}
                <div
                  className={`relative flex items-start gap-4 ${
                    isCompleted ? "" : "opacity-60"
                  }`}
                >
                  <div
                    className={`absolute -right-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white z-10 ${
                      isCompleted
                        ? "bg-[#10b981] text-white shadow-2xs"
                        : "bg-gray-100 border border-gray-300 text-gray-400"
                    }`}
                  >
                    <Check size={13} className="stroke-[2]" />
                  </div>
                  <div className="mr-2">
                    <h3
                      className={`text-sm sm:text-base ${
                        isCompleted
                          ? "font-bold text-[#059669]"
                          : "font-medium text-gray-500"
                      }`}
                    >
                      اكتملت الخدمة
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 font-medium">
                      {isCompleted
                        ? "أكد استلام الخدمة لتقييم الفني"
                        : "بانتظار التأكيد النهائي"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* الإجراءات المتاحة تتبع حالة الطلب: يُلغى ما دام جارياً، ويُؤكد
                ويُقيَّم بعد انتهائه، ولا شيء منهما بعد إلغائه */}
            {isCancelled && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center font-bold text-sm">
                تم إلغاء هذا الطلب بنجاح.
              </div>
            )}

            {isCompleted && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleConfirmCompletion}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                >
                  <Check size={18} className="stroke-[2.5]" />
                  <span>تأكيد استلام الخدمة وتقييم الفني</span>
                </button>

                <Link
                  to="/my-orders"
                  className="block w-full py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors text-center"
                >
                  العودة إلى طلباتي
                </Link>
              </div>
            )}

            {!isCompleted && !isCancelled && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
              >
                <X size={18} className="stroke-[2.5]" />
                <span>إلغاء الطلب</span>
              </button>
            )}
          </div>

          {/* العمود الأيسر (8 أعمدة): الخريطة المباشرة الحقيقية + كارت التواصل مع الفني */}
          <div className="lg:col-span-8 space-y-6 ">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
              
              {/* container الخريطة التفاعلية */}
              <div className="relative w-full h-[380px] sm:h-[450px] bg-gray-100 z-0">
                <MapContainer
                  center={position}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="w-full h-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={customIcon}>
                    <Popup>
                      موقع الخدمة الحالي - الرياض
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* شريط التواصل مع الفني المكتمل أسفل الخريطة */}
              <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                {/* أزرار الإجراءات (مراسلة / اتصال) */}
                <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-1">
                  <a
                    href="tel:+966500000000"
                    className="flex-1 sm:flex-none border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Phone size={17} />
                    <span>اتصال</span>
                  </a>

                  {/* مراسلة الفني تفتح شاشة المحادثات على مسارها الفعلي */}
                  <Link
                    to="/chat"
                    className="flex-1 sm:flex-none bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} />
                    <span>مراسله</span>
                  </Link>
                </div>

                {/* كارت الفني والصورة والتقييم */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                  <div className="text-right">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                      أحمد العتيبي
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5 justify-end">
                      <span className="text-[#2563eb] text-xs font-bold">
                        (124 تقييم)
                      </span>
                      <span className="font-bold text-gray-900 text-xs mr-1">4.8</span>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <img
                      src="/technician_avatar.jpg"
                      alt="أحمد العتيبي"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs"
                    />
                    <span className="absolute bottom-0 right-0 bg-[#10b981] w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                      <Check size={9} className="text-white stroke-[3]" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* مودال تأكيد إلغاء الطلب */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-gray-100 space-y-4" dir="rtl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <X size={24} className="stroke-[2.5]" />
            </div>

            <h3 className="font-bold text-gray-900 text-lg">تأكيد إلغاء الطلب</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              هل أنت تأكد من رغبتك في إلغاء الطلب #{id}؟ لن تتمكن من التراجع عن هذا الإجراء.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                نعم، إلغاء الطلب
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. الفوتر */}
      <Footer />
    </div>
  );
}