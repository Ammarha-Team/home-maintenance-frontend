import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock, Loader2, MapPin, MessageCircle, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import { useServiceRequest } from "../hooks/useServiceRequest";
import { OFFER_CURRENCY } from "../../requests/services/serviceRequestService";

// TEMPORARY — DEMO ONLY. See `services/demoOfferAcceptance.js`.
import { useDemoAcceptance, useDemoStage } from "../hooks/useDemoAcceptance.js";
import {
  DEMO_STAGES,
  DEMO_STAGE_ORDER,
  advanceStage,
} from "../services/demoOfferAcceptance.js";

/**
 * Where a request stands, for the customer who filed it.
 *
 * Everything on this screen that can come from the server does: the request's
 * own id, category, description, status, address, coordinates and preferred
 * date, and — when the customer has chosen an offer — that technician's real
 * name, picture, rating, profession, price and duration, read out of the offers
 * the request already carries.
 *
 * What the screen cannot draw is a live journey. The API has no endpoint that
 * moves a request along, and `ServiceRequestStatus` has no "on the way" or
 * "arrived" to move it to — the five values are PendingOffers, Assigned,
 * InProgress, Completed and Cancelled.
 *
 * So that the flow can still be walked, the three middle stages advance on a
 * local five-second timer once the customer has chosen an offer. That timer is
 * marked TEMPORARY — DEMO ONLY throughout: it writes to `localStorage` and
 * nowhere else, and the request's real status keeps its own badge at the top of
 * the card, so a demo sitting at "اكتملت الخدمة" still visibly reads whatever
 * the server actually says. Replace it with real status transitions when the
 * backend has them.
 */

// Leaflet's default marker resolves its own image paths relative to the
// stylesheet, which a bundler moves — so the icon is pointed at the CDN copy
// explicitly, as the other maps in this project do.
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// The API writes timestamps without a zone — "2026-08-24T16:19:16.08" — which
// `Date` reads as local time. That is what is wanted here: the server and the
// customer are in the same city, and appending a Z would shift every reading.
const formatTime = (value) => {
  if (!value) return "";

  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return "";

  return at.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
};

// A preferred day arrives as "2026-08-30". `Date` would read that as UTC
// midnight and hand back the day before for anyone east of Greenwich, so the
// parts are split out and rebuilt locally.
const formatDay = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/** "120" -> "ساعتان". Whole hours drop the minutes half. */
const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest} دقيقة`;
  if (!rest) return hours === 1 ? "ساعة" : `${hours} ساعات`;

  return `${hours === 1 ? "ساعة" : `${hours} ساعات`} و${rest} دقيقة`;
};

const initialOf = (name) => String(name || "؟").trim().charAt(0) || "؟";

// The journey as the customer reads it.
//
// The first two rows are answered by the server — a request has a creation
// time, and it either has offers or it does not. The last four are the demo's:
// no endpoint moves a request along, and `ServiceRequestStatus` has no value
// for "on the way" or "arrived", so their progress comes from the local store.
// `demoStage` marks which rows those are.
const TIMELINE = [
  { key: "created", title: "تم إنشاء الطلب" },
  { key: "offers", title: "وصلت العروض" },
  { key: "on_the_way", title: "الفني في الطريق", demoStage: DEMO_STAGES.onTheWay },
  { key: "arrived", title: "وصل الفني", demoStage: DEMO_STAGES.arrived },
  { key: "completed", title: "اكتملت الخدمة", demoStage: DEMO_STAGES.completed },
  { key: "rated", title: "تم تقييم الفني", demoStage: DEMO_STAGES.rated },
];

// TEMPORARY — DEMO ONLY. The steps the screen walks by itself once an offer has
// been chosen, and the pause between them.
//
// Nothing here reaches the server. There is no endpoint that moves a request
// between states, so this timer only writes to the local store — the request
// stays exactly as the API last reported it, and its real status keeps its own
// badge at the top of the card. Replacing this should be deleting the effect
// below and reading the request's true status instead.
//
// `rated` is deliberately absent: the walk stops at "completed" and waits for
// the customer to open the rating page themselves.
const AUTO_ADVANCE = [
  DEMO_STAGES.onTheWay,
  DEMO_STAGES.arrived,
  DEMO_STAGES.completed,
];

const DEMO_STEP_DELAY_MS = 5000;

export default function OrderTracking() {
  const { id: orderId } = useParams();

  const { request, loading, error } = useServiceRequest(orderId);

  // TEMPORARY — DEMO ONLY. Which of the real offers the customer pressed accept
  // on. The server knows nothing about this; it only picks which offer's real
  // technician the card below describes.
  const acceptance = useDemoAcceptance(orderId);

  // TEMPORARY — DEMO ONLY. How far the local journey has walked, and the single
  // step it is allowed to offer next.
  const { stage, next } = useDemoStage(orderId);

  const offers = request?.offers ?? [];

  const chosenOffer =
    (acceptance && offers.find((offer) => offer.id === acceptance.offerId)) ||
    null;

  const reference = orderId ? `#${String(orderId).slice(0, 8)}` : "";

  const hasPin =
    typeof request?.latitude === "number" &&
    typeof request?.longitude === "number";

  // TEMPORARY — DEMO ONLY. Walks the journey on its own so the flow can be shown
  // without the customer pressing anything.
  //
  // The first step runs immediately, so opening tracking after choosing an offer
  // shows "الفني في الطريق" straight away; each step after it waits five
  // seconds. The walk ends at "completed" — `next` is then `rated`, which is not
  // in `AUTO_ADVANCE`, so no timer is set and the screen stays put until the
  // customer opens the rating page.
  //
  // `advanceStage` only ever accepts the immediate next step, so a timer that
  // fires late (a backgrounded tab, or React re-running effects in development)
  // cannot skip a stage or walk the journey backwards.
  const autoStage = AUTO_ADVANCE.includes(next) ? next : null;
  const shouldAutoAdvance = Boolean(chosenOffer && autoStage);

  useEffect(() => {
    if (!shouldAutoAdvance) return undefined;

    const delay = stage === DEMO_STAGES.accepted ? 0 : DEMO_STEP_DELAY_MS;
    const timer = setTimeout(() => advanceStage(orderId, autoStage), delay);

    return () => clearTimeout(timer);
  }, [orderId, stage, autoStage, shouldAutoAdvance]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
        <UserNavbar />
        <main className="flex-1 flex items-center justify-center gap-2 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">جارٍ تحميل الطلب...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
        <UserNavbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-xl font-bold text-gray-900">تعذر فتح هذا الطلب</h1>
          <p className="max-w-md text-sm leading-relaxed text-gray-500">
            {error || "لم يتم العثور على هذا الطلب."}
          </p>
          <Link
            to="/my-orders"
            className="rounded-xl bg-[#2563eb] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            العودة إلى طلباتي
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Each row's state, in one place so the marker, the colour and the label can
  // never describe the step differently.
  //
  // The first two rows are answered by the server. The rest are the demo's, and
  // they only light up once an offer has been chosen — before that the journey
  // has not started, whatever the local store happens to hold.
  const currentIndex = DEMO_STAGE_ORDER.indexOf(stage);

  const timeline = TIMELINE.map((row) => {
    if (row.key === "created") {
      return {
        ...row,
        state: "done",
        detail: formatTime(request.createdAt) || "—",
      };
    }

    if (row.key === "offers") {
      return {
        ...row,
        state: offers.length ? "done" : "waiting",
        detail: offers.length
          ? `${offers.length} عرض من الفنيين`
          : "بانتظار عروض الفنيين",
      };
    }

    if (!chosenOffer) {
      return { ...row, state: "waiting", detail: "بانتظار اختيار الفني" };
    }

    const rowIndex = DEMO_STAGE_ORDER.indexOf(row.demoStage);

    if (rowIndex < currentIndex) return { ...row, state: "done", detail: "" };
    if (rowIndex === currentIndex)
      return { ...row, state: "current", detail: "الآن" };

    return { ...row, state: "waiting", detail: "" };
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
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

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-right">
          تتبع الطلب
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* حالة الطلب */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs text-right">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-50">
                {/* الحالة كما يعرّفها الخادم، لا كما تخمّنها الشاشة */}
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563eb]">
                  {request.statusLabel}
                </span>
                <h2 className="font-bold text-gray-900 text-lg">
                  حالة الطلب {reference}
                </h2>
              </div>

              <div className="relative pr-6 space-y-7">
                <div className="absolute right-3 top-2.5 bottom-2.5 w-0.5 bg-gray-200" />

                {timeline.map((row) => (
                  <div
                    key={row.key}
                    className={`relative flex items-start gap-4 ${
                      row.state === "waiting" ? "opacity-60" : ""
                    }`}
                  >
                    <div
                      className={`absolute -right-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white z-10 ${
                        row.state === "done"
                          ? "bg-[#2563eb] text-white shadow-2xs"
                          : row.state === "current"
                            ? "bg-[#10b981] text-white shadow-2xs"
                            : "bg-gray-100 border border-gray-300 text-gray-400"
                      }`}
                    >
                      {row.state === "waiting" ? (
                        <Clock size={12} />
                      ) : (
                        <Check size={13} className="stroke-[2.5]" />
                      )}
                    </div>

                    <div className="mr-2">
                      <h3
                        className={`text-sm sm:text-base ${
                          row.state === "done"
                            ? "font-bold text-[#2563eb]"
                            : row.state === "current"
                              ? "font-bold text-[#059669]"
                              : "font-medium text-gray-500"
                        }`}
                      >
                        {row.title}
                      </h3>

                      {row.detail ? (
                        <p className="text-gray-400 text-xs mt-0.5 font-medium">
                          {row.detail}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* الخدمة اكتملت: التقييم خطوة يقررها العميل، فلا انتقال تلقائي
                  إلى صفحة التقييم */}
              {chosenOffer && stage === DEMO_STAGES.completed ? (
                <Link
                  to={`/my-orders/${orderId}/review`}
                  className="mt-6 block w-full rounded-xl bg-[#2563eb] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
                >
                  تقييم الفني
                </Link>
              ) : null}
            </div>

            <Link
              to={`/my-orders/${orderId}/offers`}
              className="block w-full py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors text-center"
            >
              عرض كل العروض
            </Link>
          </div>

          {/* الخريطة والفني */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
              {/* الخريطة على إحداثيات الطلب الحقيقية */}
              {hasPin ? (
                <div className="relative w-full h-[380px] sm:h-[450px] bg-gray-100 z-0">
                  <MapContainer
                    center={[request.latitude, request.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[request.latitude, request.longitude]}
                      icon={customIcon}
                    >
                      <Popup>{request.address || "موقع الخدمة"}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="flex h-[220px] w-full items-center justify-center bg-gray-50 text-sm font-medium text-gray-400">
                  لا تتوفر إحداثيات لهذا الطلب
                </div>
              )}

              <div className="p-4 sm:p-6 border-t border-gray-100 space-y-4 bg-white text-right">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    {`خدمة ${request.categoryLabel}`}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {request.problemDescription}
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4 text-xs sm:text-sm sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-gray-400">الموعد المفضل</dt>
                    <dd className="font-semibold text-gray-700">
                      {formatDay(request.preferredDate) || "—"}
                    </dd>
                  </div>

                  {request.address && (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-gray-400">الموقع</dt>
                      <dd className="flex items-start gap-1.5 font-semibold text-gray-700">
                        <span>{request.address}</span>
                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#2563eb]" />
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* الفني — بيانات حقيقية من العرض الذي اختاره العميل */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 sm:p-6">
              {chosenOffer ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-1">
                      <Link
                        to="/chat"
                        className="flex-1 sm:flex-none bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={17} />
                        <span>مراسله</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                      <div className="text-right">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {chosenOffer.technicianName}
                        </h3>

                        {chosenOffer.professionLabel && (
                          <p className="text-gray-400 text-xs mt-0.5 font-medium">
                            {chosenOffer.professionLabel}
                          </p>
                        )}

                        {/* التقييم صفر لكل الفنيين اليوم لأن لا توجد نقطة نهاية
                            ترفعه، فيُقال ذلك بدل عرض صفر كأنه درجة */}
                        {typeof chosenOffer.rating === "number" &&
                        chosenOffer.rating > 0 ? (
                          <div className="flex items-center gap-1 mt-0.5 justify-end">
                            <span className="font-bold text-gray-900 text-xs">
                              {chosenOffer.rating.toFixed(1)}
                            </span>
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                          </div>
                        ) : (
                          <p className="text-gray-400 text-[11px] mt-0.5">
                            لا توجد تقييمات بعد
                          </p>
                        )}
                      </div>

                      <div className="relative shrink-0">
                        {chosenOffer.technicianProfilePicture ? (
                          <img
                            src={chosenOffer.technicianProfilePicture}
                            alt=""
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="w-14 h-14 rounded-full border-2 border-white bg-[#e8f0fe] text-[#2563eb] flex items-center justify-center text-xl font-bold shadow-2xs"
                          >
                            {initialOf(chosenOffer.technicianName)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <dl className="mt-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm">
                    {chosenOffer.durationInMinutes ? (
                      <div className="flex items-center gap-2">
                        <dt className="text-gray-400">مدة التنفيذ</dt>
                        <dd className="font-semibold text-gray-700">
                          {formatDuration(chosenOffer.durationInMinutes)}
                        </dd>
                      </div>
                    ) : null}

                    {typeof chosenOffer.price === "number" ? (
                      <div className="flex items-center gap-2">
                        <dt className="text-gray-400">السعر المتفق عليه</dt>
                        <dd className="font-bold text-[#2563eb]">
                          {`${chosenOffer.price.toLocaleString("ar-EG")} ${OFFER_CURRENCY}`}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {/* الرحلة انتهت. لا نجوم ولا تعليق هنا: التقييم بكامله — من
                      اختيار النجوم إلى كتابة الملاحظة — يعيش على صفحة التقييم
                      وحدها، وهذه الشاشة تعرض مسار الطلب وحالته فقط. */}
                  {stage === DEMO_STAGES.rated ? (
                    <div className="mt-6 border-t border-gray-100 pt-6 text-center">
                      <span
                        aria-hidden="true"
                        className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e6f7ed] text-[#059669]"
                      >
                        <Check size={26} className="stroke-[2.5]" />
                      </span>

                      <h3 className="mt-3 text-lg font-bold text-gray-900">
                        تم إنهاء الطلب
                      </h3>

                      <Link
                        to="/my-orders"
                        className="mt-5 inline-block rounded-xl bg-[#2563eb] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                      >
                        العودة إلى طلباتي
                      </Link>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">
                    لم يتم اختيار فني لهذا الطلب بعد.
                  </p>
                  <Link
                    to={`/my-orders/${orderId}/offers`}
                    className="mt-3 inline-block rounded-xl bg-[#2563eb] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                  >
                    استعراض العروض
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
