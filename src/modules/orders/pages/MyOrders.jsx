import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import Breadcrumb from "../../../shared/components/Breadcrumb";
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import OrderCard from "../components/OrderCard";

const MOCK_ORDERS = [
  {
    id: 1,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "pending",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: "view_offers",
  },
  {
    id: 2,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "in_progress",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: "track",
  },
  {
    id: 3,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "completed",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: null,
  },
  {
    id: 4,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "canceled",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: "reorder",
  },
  {
    id: 5,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "in_progress",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: "track",
  },
  {
    id: 6,
    title: "خدمه كهربائيه",
    date: "8/8/2026",
    status: "pending",
    subtitle: "تلف لوحه المفاتيح",
    description:
      "تلف شائع في اكياس الكهرباء والاسلاك الكهربائية، يحتاج إلى فحص وتغيير القطع التالفة فوراً لضمان السلامة.",
    image: "/electrical_socket.jpg",
    actionType: "view_offers",
  },
];

export default function MyOrders() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "completed" && (order.status === "completed" || order.status === "in_progress")) ||
      (activeFilter === "pending" && order.status === "pending") ||
      (activeFilter === "canceled" && order.status === "canceled");

    const matchesSearch =
      order.title.includes(searchQuery) ||
      order.subtitle.includes(searchQuery) ||
      order.description.includes(searchQuery);

    const matchesDate = !selectedDate || order.date === selectedDate;

    return matchesFilter && matchesSearch && matchesDate;
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
            {[
              { id: "all", label: "الكل" },
              { id: "completed", label: "مكتمله" },
              { id: "pending", label: "معلقه" },
              { id: "canceled", label: "ملغيه" },
            ].map((tab) => (
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

            {/* Calendar Popover */}
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
                  <button onClick={() => setSelectedDate("1/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">1</button>
                  <button onClick={() => setSelectedDate("2/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">2</button>
                  <button onClick={() => setSelectedDate("3/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">3</button>
                  <button onClick={() => setSelectedDate("4/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">4</button>

                  <button onClick={() => setSelectedDate("5/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">5</button>
                  <button
                    onClick={() => {
                      setSelectedDate("8/8/2026");
                      setShowDatePicker(false);
                    }}
                    className="py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30"
                  >
                    6
                  </button>
                  <button onClick={() => setSelectedDate("7/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">7</button>
                  <button onClick={() => setSelectedDate("8/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">8</button>
                  <button onClick={() => setSelectedDate("9/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">9</button>
                  <button onClick={() => setSelectedDate("10/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">10</button>
                  <button onClick={() => setSelectedDate("11/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">11</button>

                  <button onClick={() => setSelectedDate("12/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">12</button>
                  <button onClick={() => setSelectedDate("13/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">13</button>
                  <button onClick={() => setSelectedDate("14/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">14</button>
                  <button onClick={() => setSelectedDate("15/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">15</button>
                  <button onClick={() => setSelectedDate("16/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">16</button>
                  <button onClick={() => setSelectedDate("17/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">17</button>
                  <button onClick={() => setSelectedDate("18/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">18</button>

                  <button onClick={() => setSelectedDate("19/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">19</button>
                  <button onClick={() => setSelectedDate("20/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">20</button>
                  <button onClick={() => setSelectedDate("21/10/2026")} className="py-1.5 rounded-lg hover:bg-gray-100">21</button>
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
              placeholder="خدمه كهربائيه"
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
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-2xs my-8">
            <p className="text-gray-500 font-medium text-sm sm:text-base">لا توجد طلبات تطابق هذا البحث.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}