import React, { useEffect, useRef, useState } from "react";
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
  LoaderCircle,
} from "lucide-react";

import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import { useToast } from "../../../shared/toast/toastContext.js";
import useChatThread from "../hooks/useChatThread.js";
import { CONNECTION_STATES } from "../services/chatHub.js";

// The API sends no picture with a conversation, so the portrait the design
// already ships stands in for everyone.
const DEFAULT_AVATAR = "/technician_avatar.jpg";

// What the header says under the name. A conversation carries no trade or title
// — only who the other party is — so the slot holds the one thing about them the
// hub does report.
const presenceLabel = (online) => (online ? "متصل الآن" : "غير متصل");

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const { showToast } = useToast();

  const {
    conversations,
    activeConversation,
    activeId,
    messages,
    loading,
    error,
    sendError,
    connectionState,
    isPartnerOnline,
    isPartnerTyping,
    isOnline,
    selectConversation,
    sendMessage,
    notifyTyping,
  } = useChatThread();

  const thread = useRef(null);

  // The newest message is the one worth seeing. Anything that lengthens the
  // thread — sending, receiving, opening another conversation — brings the
  // bottom back into view.
  //
  // The pane is scrolled directly rather than through `scrollIntoView`, which
  // walks every scrollable ancestor and would take the page with it.
  useEffect(() => {
    const pane = thread.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [messages.length, activeId, isPartnerTyping]);

  // A refused send is reported once, where the eye already is.
  useEffect(() => {
    if (sendError) {
      showToast({
        message: sendError.message || "تعذر إرسال الرسالة. حاول مرة أخرى.",
        variant: "error",
      });
    }
  }, [sendError, showToast]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const sent = await sendMessage(inputText);
    setSending(false);

    // The box is only cleared once the server has the message. A failed send
    // leaves the words where they were, ready to try again.
    if (sent) setInputText("");
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    notifyTyping();
  };

  const filteredConversations = conversations.filter(
    (c) => c.name.includes(searchQuery) || c.lastMessage.includes(searchQuery)
  );

  const reconnecting =
    connectionState === CONNECTION_STATES.reconnecting ||
    connectionState === CONNECTION_STATES.disconnected;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir="rtl">
      {/* 1. النافبار العلوي */}
      <UserNavbar />

      {/* 2. محتوى المحادثات الرئيسية */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        {/* The card is bounded rather than left to grow with the thread — see
            `.chat-shell`. Everything below scrolls inside it. */}
        <div className="chat-shell bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col lg:flex-row w-full">

          {/* الشريط الجانبي للمحادثات */}
          {/* Stacked below `lg`, the list takes a share of the card rather than
              all of it, so the open thread is still on screen underneath. */}
          <div className="w-full lg:w-80 max-h-[38%] lg:max-h-none min-h-0 border-b lg:border-b-0 lg:border-l border-gray-100 flex flex-col bg-white shrink-0">
            <div className="shrink-0 p-4 sm:p-5 flex items-center justify-between">
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
            <div className="shrink-0 px-4 pb-3">
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
            <div className="chat-scroll min-h-0 flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading ? (
                <div
                  role="status"
                  className="flex items-center justify-center gap-2 p-6 text-xs text-gray-400 font-medium"
                >
                  <LoaderCircle size={16} className="animate-spin" />
                  جاري تحميل المحادثات...
                </div>
              ) : null}

              {!loading && error ? (
                <p
                  role="alert"
                  className="p-6 text-center text-xs text-[#e56b6b] font-medium"
                >
                  {error.message || "تعذر تحميل المحادثات."}
                </p>
              ) : null}

              {!loading && !error && filteredConversations.length === 0 ? (
                <p className="p-6 text-center text-xs text-gray-400 font-medium">
                  لا توجد محادثات بعد.
                </p>
              ) : null}

              {filteredConversations.map((chat) => {
                const isSelected = chat.id === activeId;
                const online = isOnline(chat.otherUserId);

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => selectConversation(chat.id)}
                    className={`w-full p-4 flex items-center gap-3 transition-colors text-right cursor-pointer relative ${
                      isSelected
                        ? "bg-blue-50/40 border-r-4 border-[#2563eb]"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={DEFAULT_AVATAR}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                      {online && (
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

                      <div className="flex items-center justify-between gap-2">
                        {/* عدد الرسائل غير المقروءة كما يرسله الخادم */}
                        {chat.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}

                        <p className="flex-1 text-xs text-[#2563eb] truncate font-medium dir-rtl">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* شباك المحادثة النشطة */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-white">

            {/* الهيدر العلوي */}
            {/* Pinned by not scrolling rather than by `sticky`: it is a sibling
                of the scrolling thread, not a child of it. */}
            <div className="shrink-0 p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
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
                    {activeConversation?.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {!activeConversation
                      ? ""
                      : reconnecting
                        ? "جاري إعادة الاتصال..."
                        : presenceLabel(isPartnerOnline)}
                  </p>
                </div>

                <div className="relative shrink-0">
                  <img
                    src={DEFAULT_AVATAR}
                    alt={activeConversation?.name ?? ""}
                    className="w-11 h-11 rounded-full object-cover border border-gray-100"
                  />
                  {isPartnerOnline && (
                    <span className="absolute bottom-0 right-0 bg-[#10b981] w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCheck size={8} className="text-white stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div
              ref={thread}
              className="chat-scroll min-h-0 flex-1 bg-[#f8fafc]/50 p-4 sm:p-6 overflow-y-auto space-y-6 flex flex-col justify-start"
            >
              <div className="flex justify-center">
                <span className="bg-blue-50/70 text-gray-500 text-xs px-4 py-1.5 rounded-full font-medium">
                  اليوم
                </span>
              </div>

              <div className="space-y-4 flex flex-col">
                {messages.map((msg) => {
                  // رسائل العميل جهة اليمين، ورسائل الفني جهة اليسار. الصفحة
                  // كلها RTL، فبداية المحور هي اليمين ونهايته اليسار.
                  //
                  // الجهة تُقرأ من مُرسِل الرسالة مقارنةً بالحساب الحالي، لا من
                  // نوع الحساب، فلا يمكن أن تظهر شاشة العميل بمنظور الفني.
                  const isCustomer = msg.mine;

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
                          <CheckCheck
                            size={14}
                            className={
                              msg.seen ? "text-[#0062e0]" : "text-gray-300"
                            }
                          />
                        )}
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  );
                })}

                {/* مؤشر الكتابة، يظهر ما دام الطرف الآخر يكتب */}
                {isPartnerTyping && (
                  <div className="flex flex-col items-end">
                    <div className="max-w-[60%] px-4 py-3 rounded-2xl bg-gray-200/70 text-gray-500 text-sm font-medium rounded-bl-2xl rounded-tl-xs rounded-tr-2xl rounded-br-2xl">
                      يكتب الآن...
                    </div>
                  </div>
                )}

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
            <div className="shrink-0 p-4 bg-white border-t border-gray-100">
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
                    onChange={handleInputChange}
                    disabled={!activeConversation}
                    placeholder="اكتب رسالة"
                    className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 text-sm rounded-full py-3 pr-5 pl-12 focus:outline-hidden focus:ring-2 focus:ring-[#0062e0]/20 border-none font-medium"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || !activeConversation || sending}
                    className="absolute left-1.5 p-2 bg-[#0062e0] hover:bg-blue-700 disabled:opacity-40 text-white rounded-full transition-all cursor-pointer flex items-center justify-center"
                  >
                    {sending ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Send
                        size={16}
                        className="rotate-180 transform -translate-x-0.5"
                      />
                    )}
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
