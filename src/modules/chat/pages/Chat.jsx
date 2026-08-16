import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MoreVertical,
  MapPin,
  Plus,
  Send,
  Mic,
  CheckCheck,
  Search,
  SquarePen,
} from "lucide-react";

import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";

export default function Chat() {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");

  // قائمة المحادثات الجانبية
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "أحمد العتيبي",
      title: "أخصائي تمديدات كهربائية وأنابيب ذكية",
      avatar: "/technician_avatar.jpg",
      lastMessage: "علي الطريق السريع 5 دقايق هكون...",
      time: "الآن",
      isOnline: true,
      unreadCount: 0,
    },
    {
      id: 2,
      name: "خالد محمد",
      title: "أخصائي صيانة تكييف",
      avatar: "/technician_avatar.jpg",
      lastMessage: "شكراً لك، تم إنجاز العمل بنجاح",
      time: "أمس",
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 3,
      name: "فريق الدعم",
      title: "خدمة العملاء",
      avatar: "/technician_avatar.jpg",
      lastMessage: "تم تحديث حالة طلبك رقم #1024",
      time: "12 أكتوبر",
      isOnline: false,
      unreadCount: 0,
    },
  ]);

  // قائمة الرسائل مقسمة بحسب ID كل محادثة
  const [allMessages, setAllMessages] = useState({
    // الشاشة شاشة العميل: هو من يسأل عن موعد الوصول، والفني هو من يرد بأنه في
    // الطريق — وهي آخر رسالة تظهر في قائمة المحادثات باسم الفني.
    1: [
      {
        id: 1,
        sender: "user",
        text: "انت فين ؟؟",
        time: "09:42 ص",
      },
      {
        id: 2,
        sender: "technician",
        text: "علي الطريق السريع 5 دقايق هكون عند حضرتك",
        time: "09:42 ص",
      },
    ],
    2: [
      {
        id: 1,
        sender: "technician",
        text: "شكراً لك، تم إنجاز العمل بنجاح",
        time: "أمس",
      },
    ],
    3: [
      {
        id: 1,
        sender: "technician",
        text: "تم تحديث حالة طلبك رقم #1024",
        time: "12 أكتوبر",
      },
    ],
  });

  // المحادثة النشطة حالياً
  const activeChat = conversations.find((c) => c.id === selectedChatId);

  // الرسائل الخاصة بالمحادثة النشطة فقط (لو مفيش بيرجع مصفوفة فاضية)
  const activeMessages = allMessages[selectedChatId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      time: currentTime,
    };

    // 1. إضافة الرسالة للمحادثة المحددة فقط
    setAllMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));

    // 2. تحديث أحدث رسالة (lastMessage) في القائمة الجانبية للشات الحالي فقط
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, lastMessage: inputText, time: "الآن" }
          : c
      )
    );

    setInputText("");
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.lastMessage.includes(searchQuery) ||
      c.title.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      {/* 1. النافبار العلوي */}
      <UserNavbar />

      {/* 2. محتوى المحادثات الرئيسية */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col lg:flex-row min-h-[680px] w-full">
          
          {/* الشريط الجانبي للمحادثات */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-l border-gray-100 flex flex-col bg-white shrink-0">
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <button
                type="button"
                className="text-gray-500 hover:text-[#2563eb] transition-colors p-1"
                title="محادثة جديدة"
              >
                <SquarePen size={20} />
              </button>
              <h2 className="font-bold text-gray-900 text-lg sm:text-xl">
                الرسائل
              </h2>
            </div>

            {/* حقل البحث */}
            <div className="px-4 pb-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="البحث في المحادثات"
                  className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 pr-9 pl-3 focus:outline-hidden focus:ring-1 focus:ring-blue-500 border border-gray-100 font-medium"
                />
                <Search
                  size={16}
                  className="absolute right-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* قائمة المحادثات */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filteredConversations.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full p-4 flex items-center gap-3 transition-colors text-right cursor-pointer relative ${
                      isSelected
                        ? "bg-blue-50/40 border-r-4 border-[#2563eb]"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                      {chat.isOnline && (
                        <span className="absolute bottom-0 right-0 bg-[#10b981] w-3.5 h-3.5 rounded-full border-2 border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-gray-400 font-medium shrink-0">
                          {chat.time}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {chat.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#2563eb] truncate font-medium dir-rtl">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* شباك المحادثة النشطة */}
          <div className="flex-1 flex flex-col bg-white">
            
            {/* الهيدر العلوي */}
            <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  title="خيارات إضافية"
                >
                  <MoreVertical size={18} />
                </button>
                <a
                  href="tel:+966500000000"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  title="اتصال تلفوني"
                >
                  <Phone size={18} />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h2 className="font-bold text-gray-900 text-base sm:text-lg">
                    {activeChat?.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {activeChat?.title}
                  </p>
                </div>

                <div className="relative shrink-0">
                  <img
                    src={activeChat?.avatar || "/technician_avatar.jpg"}
                    alt={activeChat?.name}
                    className="w-11 h-11 rounded-full object-cover border border-gray-100"
                  />
                  {activeChat?.isOnline && (
                    <span className="absolute bottom-0 right-0 bg-[#10b981] w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCheck size={8} className="text-white stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 bg-[#f8fafc]/50 p-4 sm:p-6 overflow-y-auto space-y-6 flex flex-col justify-start">
              <div className="flex justify-center">
                <span className="bg-blue-50/70 text-gray-500 text-xs px-4 py-1.5 rounded-full font-medium">
                  اليوم
                </span>
              </div>

              <div className="space-y-4 flex flex-col">
                {activeMessages.map((msg) => {
                  // رسائل العميل جهة اليمين، ورسائل الفني جهة اليسار. الصفحة
                  // كلها RTL، فبداية المحور هي اليمين ونهايته اليسار.
                  const isCustomer = msg.sender === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isCustomer ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[60%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                          isCustomer
                            ? "bg-[#0062e0] text-white rounded-br-2xl rounded-tr-xs rounded-tl-2xl rounded-bl-2xl"
                            : "bg-gray-200/70 text-gray-800 rounded-bl-2xl rounded-tl-xs rounded-tr-2xl rounded-br-2xl"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* علامة القراءة تخص ما أرسله العميل نفسه، لا ما يصله */}
                      <div
                        className={`flex items-center gap-1 mt-1 text-[11px] text-gray-400 px-1 ${
                          isCustomer ? "flex-row-reverse" : ""
                        }`}
                      >
                        {isCustomer && (
                          <CheckCheck size={14} className="text-[#0062e0]" />
                        )}
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  );
                })}

                {/* شارة شارك موقعك المباشر */}
                <div className="flex justify-center my-4">
                  <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs">
                    <MapPin size={18} className="fill-[#15803d]/20" />
                    <span>تمت مشاركة موقعك المباشر للفني</span>
                  </div>
                </div>
              </div>
            </div>

            {/* حقل إدخال الرسائل */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  className="p-2.5 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  title="تسجيل صوتي"
                >
                  <Mic size={22} />
                </button>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="اكتب رسالة"
                    className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 text-sm rounded-full py-3 pr-5 pl-12 focus:outline-hidden focus:ring-2 focus:ring-[#0062e0]/20 border-none font-medium"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="absolute left-1.5 p-2 bg-[#0062e0] hover:bg-blue-700 disabled:opacity-40 text-white rounded-full transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Send
                      size={16}
                      className="rotate-180 transform -translate-x-0.5"
                    />
                  </button>
                </div>

                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="إضافة ملف أو صورة"
                >
                  <Plus size={20} />
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}