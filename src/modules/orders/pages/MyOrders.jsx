import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar as CalendarIcon, X, Loader2 } from "lucide-react";
import Breadcrumb from "../../../shared/components/Breadcrumb";
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import OrderCard from "../components/OrderCard";
import { useMyServiceRequests } from "../hooks/useMyServiceRequests";

// TEMPORARY — DEMO ONLY. See `services/demoOfferAcceptance.js`.
import { useDemoAcceptanceState } from "../hooks/useDemoAcceptance.js";
import { DEMO_STAGES, stageOf } from "../services/demoOfferAcceptance.js";

// The four buckets of the board.
//
// The enum has five values and the board has four tabs: Assigned and InProgress
// are both stages of a job already under way, and neither is "معلقة" nor
// "مكتملة". They appear under "الكل" rather than being forced into a tab that
// would misdescribe them.
//
// Status used to be a query parameter, so the server did the filtering. It is
// done here instead, because a request the customer has finished in the demo is
// still `PendingOffers` on the server: asking the API for the completed ones
// would never return it, and asking for the pending ones would hand it back as
// unfinished work. The endpoint returns the customer's whole list unpaginated,
// so splitting it here costs nothing. Delete the demo store and the `status`
// parameter comes back.
const STATUS_TABS = [
  { id: "all", label: "الكل" },
  { id: "completed", label: "مكتمله" },
  { id: "pending", label: "معلقه" },
  { id: "canceled", label: "ملغيه" },
];

// Which tab a request belongs under. Anything else — Assigned, InProgress —
// belongs to no bucket and shows only under "الكل".
const bucketOf = (status) => {
  if (status === "Completed") return "completed";
  if (status === "PendingOffers") return "pending";
  if (status === "Cancelled") return "canceled";

  return null;
};

export default function MyOrders() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarRef = useRef(null);

  // The whole list, filtered below. The API's `search` matches the English
  // category name only, which an Arabic term never hits, so search and date are
  // applied to the records that come back rather than asked for.
  const { requests, loading, error, reload } = useMyServiceRequests();

  // TEMPORARY — DEMO ONLY. A request the customer has walked to the end of the
  // demo — accepted an offer, watched the journey, left a rating — is finished
  // as far as this browser is concerned, even though the server still calls it
  // `PendingOffers` because nothing can move it. It is shown as مكتملة and kept
  // out of "معلقه" so a completed job stops reading as outstanding work.
  const demoState = useDemoAcceptanceState();
  const isDemoFinished = (id) => stageOf(demoState, id) === DEMO_STAGES.rated;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const term = searchQuery.trim();

  const filteredOrders = requests
    .map((order) =>
      isDemoFinished(order.id)
        ? { ...order, status: "Completed", statusLabel: "مكتملة", demoRated: true }
        : order,
    )
    .filter((order) => {
      const matchesTab =
        activeFilter === "all" || bucketOf(order.status) === activeFilter;

      const matchesSearch =
        !term ||
        order.categoryLabel.includes(term) ||
        order.problemDescription.includes(term);

      const matchesDate = !selectedDate || order.preferredDate === selectedDate;

      return matchesTab && matchesSearch && matchesDate;
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      <UserNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <Breadcrumb items={[{ label: "طلباتي" }]} />

        {/* Header & Status Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">كل الطلبات</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              تتبع حالة طلبات الصيانة الحالية والسابقة
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-blue-50 text-blue-600 border-blue-200 shadow-2xs"
                    : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Date Filter Bar */}
        <div className="max-w-xl mx-auto flex items-center gap-3 mb-8 w-full relative">

          {/* Date Picker Trigger */}
          <div className="relative" ref={calendarRef}>
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              aria-label="Filter by date"
              className={`border rounded-xl p-2.5 flex items-center justify-center min-w-[44px] h-[42px] cursor-pointer transition-colors shadow-2xs ${
                selectedDate || showDatePicker
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              <CalendarIcon size={18} />
            </button>

            {/* Calendar Popover. The days carry the API's own date form —
                "2026-10-06" — so a picked day can be compared to a request's
                preferred date without either side being reformatted. */}
            {showDatePicker && (
              <div className="absolute right-0 sm:right-0 top-12 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 sm:p-5 w-[290px] sm:w-[310px] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <CalendarIcon size={14} />
                    <span>اليوم: 12 أكتوبر</span>
                  </div>
                  <h3 className="text-blue-600 font-bold text-base">أكتوبر 2026</h3>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 font-medium mb-3">
                  <span>أحد</span>
                  <span>اثنين</span>
                  <span>ثلاثاء</span>
                  <span>أربعاء</span>
                  <span>خميس</span>
                  <span>جمعة</span>
                  <span>سبت</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-700 mb-2">
                  <span className="text-gray-200 py-1.5">28</span>
                  <span className="text-gray-200 py-1.5">29</span>
                  <span className="text-gray-200 py-1.5">30</span>

                  {Array.from({ length: 21 }, (_, index) => index + 1).map(
                    (day) => {
                      const value = `2026-10-${String(day).padStart(2, "0")}`;
                      const active = selectedDate === value;

                      return (
                        <button
                          key={value}
                          onClick={() => {
                            setSelectedDate(value);
                            setShowDatePicker(false);
                          }}
                          className={`py-1.5 ${
                            active
                              ? "rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30"
                              : "rounded-lg hover:bg-gray-100"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    },
                  )}
                </div>

                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-full mt-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={12} />
                    إلغاء تصفية التاريخ
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث في طلباتك"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 pr-10 text-sm text-right focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs h-[42px] placeholder:text-gray-400"
            />
            <Search
              size={18}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 my-8 flex items-center justify-center gap-2 border border-gray-100 shadow-2xs text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span className="font-medium text-sm sm:text-base">
              جارٍ تحميل طلباتك...
            </span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-2xs my-8">
            <p className="text-gray-700 font-medium text-sm sm:text-base">{error}</p>

            <button
              type="button"
              onClick={reload}
              className="mt-4 px-6 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-2xs my-8">
            <p className="text-gray-500 font-medium text-sm sm:text-base">
              {requests.length
                ? "لا توجد طلبات تطابق هذا البحث."
                : "لا توجد طلبات بعد."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
