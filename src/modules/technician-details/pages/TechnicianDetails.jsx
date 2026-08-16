import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  ChevronLeft,
  MapPin,
  Star,
  Wallet,
} from "lucide-react";

import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";

/**
 * The technician as a customer sees them, reached from an offer on an order.
 *
 * Deliberately not the technician's own profile screen: that one is an editing
 * surface behind the technician navbar, with the camera button, the certificate
 * uploads and the personal details its owner fills in. A customer needs the
 * opposite — what the technician charges, where they work, what they have built
 * before, and a way to accept them for this order.
 */

const TECHNICIAN = {
  name: "أحمد العتيبي",
  specialty: "أخصائي تمديدات كهربائية وأنظمة ذكية",
  experience: "12 سنه من الخبره",
  rating: "4.8",
  reviewsCount: "124 تقييم",
  avatar: "/technician_avatar.jpg",
  skills: ["كهربة", "أنظمة إنذار", "صيانة دورية"],
  workScope: "الشيخ زايد",
  inspectionPrice: "100 جنيه مصري",
  about:
    "خبير فني متخصص في التمديدات الكهربائية بخبرة تتجاوز العقد. أركز على تقديم حلول مستدامة وآمنة للمنازل العصرية، مع تخصص دقيق في تركيب أنظمة المنازل الذكية وتوزيع الإضاءة المعمارية. ملتزم بالدقة في المواعيد واتباع أرقى معايير السلامة المهنية. هدفنا دائماً هو تحويل منزلك إلى مساحة آمنة ومريحة باستخدام أحدث التقنيات.",
  portfolio: [
    { src: "/gallery/patio.jpg", alt: "إضاءة حديقة خارجية" },
    { src: "/gallery/electrical_panel.jpg", alt: "لوحة توزيع كهربائية" },
    { src: "/gallery/lighting.jpg", alt: "إضاءة مجلس" },
    { src: "/gallery/smart_home.jpg", alt: "شاشة تحكم منزل ذكي" },
  ],
  remainingPortfolioCount: 12,
  comments: [
    {
      id: 1,
      name: "سارة الشمري",
      rating: 5,
      body: "فني ممتاز ومحترف جداً. قام بإصلاح عطل كهربائي معقد في وقت قياسي. أنصح بالتعامل معه بشدة.",
      time: "قبل ٣ أيام",
    },
    {
      id: 2,
      name: "فهد العتيبي",
      rating: 4,
      body: "دقة في المواعيد وسعر مناسب مقارنة بجودة العمل. قام بتركيب نظام المنزل الذكي ببراعة.",
      time: "قبل أسبوع",
    },
  ],
};

function Stars({ value, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

export default function TechnicianDetails() {
  // The order the technician was offered on. Reached from a pasted link with no
  // order in the address, the orders list stands in for it.
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const trackPath = orderId ? `/my-orders/${orderId}/track` : "/my-orders";
  const offersPath = orderId ? `/my-orders/${orderId}` : "/my-orders";

  // Accepting ends on the tracking screen — that is where the order lives once
  // a technician is on it.
  const confirmAccept = () => {
    setShowAcceptModal(false);
    navigate(trackPath);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* البريدكرامب */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#8e9aaf]">
            <li>
              <Link to="/home" className="hover:text-[#2563eb] transition-colors">
                الرئيسيه
              </Link>
            </li>
            <li>
              <ChevronLeft size={14} className="text-[#8e9aaf]" />
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-[#2563eb] transition-colors">
                طلباتي
              </Link>
            </li>
            <li>
              <ChevronLeft size={14} className="text-[#8e9aaf]" />
            </li>
            <li>
              <Link to={offersPath} className="hover:text-[#2563eb] transition-colors">
                عرض العروض المتقدمه
              </Link>
            </li>
            <li>
              <ChevronLeft size={14} className="text-[#8e9aaf]" />
            </li>
            <li>
              <span className="text-[#2563eb] font-semibold" aria-current="page">
                تفاصيل الفني
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* العمود الرئيسي: بيانات الفني وأعماله وتعليقات عملائه */}
          <div className="lg:col-span-8 space-y-6">
            {/* كارت بيانات الفني */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 sm:p-8 text-center">
              <div className="relative inline-block">
                <img
                  src={TECHNICIAN.avatar}
                  alt={TECHNICIAN.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                />
                <BadgeCheck
                  size={26}
                  className="absolute bottom-0 right-0 text-[#10b981] fill-white"
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-[#e6f7ed] text-[#059669] text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  {TECHNICIAN.experience}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {TECHNICIAN.name}
                </h1>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm mt-1 font-medium">
                {TECHNICIAN.specialty}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-[#2563eb] text-xs font-bold">
                  ({TECHNICIAN.reviewsCount})
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  {TECHNICIAN.rating}
                </span>
                <Stars value={Math.round(Number(TECHNICIAN.rating))} />
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                {TECHNICIAN.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-50 border border-gray-100 text-gray-600 text-[11px] sm:text-xs font-medium px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* نبذة عن الفني */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 sm:p-6 text-right">
              <h2 className="text-[#2563eb] font-bold text-base sm:text-lg mb-3">
                عن {TECHNICIAN.name}
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm leading-loose">
                {TECHNICIAN.about}
              </p>
            </section>

            {/* صور الأعمال السابقة */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-[#2563eb] text-xs font-semibold hover:underline cursor-pointer"
                >
                  مشاهده الكل
                </button>

                <h2 className="text-[#2563eb] font-bold text-base sm:text-lg">
                  صور الاعمال السابقه
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TECHNICIAN.portfolio.map((item) => (
                  <img
                    key={item.src}
                    src={item.src}
                    alt={item.alt}
                    className="h-32 sm:h-40 w-full rounded-xl object-cover border border-gray-100"
                  />
                ))}

                <button
                  type="button"
                  className="h-32 sm:h-40 w-full rounded-xl border border-gray-100 bg-gray-50 text-gray-500 flex flex-col items-center justify-center gap-1 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-lg leading-none">+</span>
                  <span>{TECHNICIAN.remainingPortfolioCount} صوره</span>
                </button>
              </div>
            </section>

            {/* تعليقات العملاء */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="text-[#2563eb] text-xs font-semibold hover:underline cursor-pointer"
                >
                  مشاهده الكل
                </button>

                <h2 className="text-[#2563eb] font-bold text-base sm:text-lg">
                  التعليقات
                </h2>
              </div>

              <ul className="divide-y divide-gray-50">
                {TECHNICIAN.comments.map((comment) => (
                  <li key={comment.id} className="py-4 first:pt-0 last:pb-0 text-right">
                    <div className="flex items-center justify-between gap-3">
                      <Stars value={comment.rating} size={13} />

                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {comment.name}
                        </h3>

                        <span
                          aria-hidden="true"
                          className="w-8 h-8 rounded-full bg-blue-50 text-[#2563eb] text-xs font-bold flex items-center justify-center shrink-0"
                        >
                          {comment.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                      {comment.body}
                    </p>

                    <span className="text-gray-400 text-[11px] mt-2 block">
                      {comment.time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* العمود الجانبي: نطاق العمل والسعر وقبول الطلب */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 text-right space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-900 text-sm font-semibold">
                  {TECHNICIAN.workScope}
                </span>

                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                  <span>نطاق العمل</span>
                  <MapPin size={16} className="text-[#2563eb]" />
                </div>
              </div>

              <div className="h-px bg-gray-50" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-900 text-sm font-semibold">
                  {TECHNICIAN.inspectionPrice}
                </span>

                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                  <span>سعر الفحص</span>
                  <Wallet size={16} className="text-[#2563eb]" />
                </div>
              </div>
            </div>

            <div className="bg-[#e8f0fe]/60 rounded-2xl border border-blue-100 p-5 text-right">
              <h2 className="text-gray-900 font-bold text-sm sm:text-base leading-relaxed">
                هل تريد قبول طلب الخدمه من الفني؟
              </h2>

              <button
                type="button"
                onClick={() => setShowAcceptModal(true)}
                className="mt-4 w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer"
              >
                قبول الطلب
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* تأكيد قبول الفني */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-gray-100 space-y-4"
            dir="rtl"
          >
            <div className="w-12 h-12 rounded-full bg-[#e6f7ed] text-[#059669] mx-auto flex items-center justify-center">
              <BadgeCheck size={24} />
            </div>

            <h3 className="font-bold text-gray-900 text-lg">تأكيد قبول الفني</h3>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              سيتم إسناد الطلب إلى {TECHNICIAN.name}، ويمكنك متابعة الزيارة من
              صفحة تتبع الطلب.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={confirmAccept}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                نعم، قبول الطلب
              </button>

              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
