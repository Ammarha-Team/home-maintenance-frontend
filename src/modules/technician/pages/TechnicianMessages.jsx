import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCheck,
  MapPin,
  Mic,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  SquarePen,
} from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import {
  CONVERSATIONS,
  THREADS,
  findConversation,
} from '../services/technicianService.js'

/** A row in the conversation list. The avatar leads, so it sits at the right. */
function ConversationRow({ conversation, active, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={active ? 'true' : undefined}
        className={`flex w-full items-center gap-[16px] border-r-[3px] px-[24px] py-[24px] text-right transition-colors ${
          active
            ? 'border-primary-500 bg-primary-50'
            : 'border-transparent hover:bg-card'
        }`}
      >
        <span className="relative shrink-0">
          <span
            aria-hidden="true"
            className="flex size-[48px] items-center justify-center rounded-full bg-primary-50 text-[18px] font-bold text-primary-700"
          >
            {conversation.name.charAt(0)}
          </span>

          {conversation.online ? (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 size-[14px] rounded-full border-2 border-white bg-success-500"
            />
          ) : null}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
          {/* Name right, stamp left. */}
          <span className="flex items-baseline justify-between gap-[8px]">
            <span className="truncate text-[16px] leading-[1.3] font-bold text-text-500">
              {conversation.name}
            </span>
            <span className="shrink-0 text-[12px] leading-[1.25] text-text-200">
              {conversation.stamp}
            </span>
          </span>

          <span
            className={`truncate text-[14px] leading-[1.3] ${
              conversation.unread ? 'font-bold text-primary-500' : 'text-text-300'
            }`}
          >
            {conversation.preview}
          </span>
        </span>
      </button>
    </li>
  )
}

/** One entry in the thread — a day marker, a bubble, or the location notice. */
function ThreadEntry({ entry, orderId }) {
  if (entry.kind === 'day') {
    return (
      <li className="flex justify-center">
        <span className="rounded-[8px] bg-primary-50 px-[16px] py-[6px] text-[16px] leading-[1.5] text-text-300">
          {entry.text}
        </span>
      </li>
    )
  }

  if (entry.kind === 'location') {
    return (
      <li className="flex justify-center">
        <span className="flex items-center gap-[12px] rounded-[8px] bg-success-100 px-[16px] py-[11px] text-[16px] leading-[1.5] text-text-400">
          <MapPin size={16} aria-hidden="true" className="shrink-0" />
          {entry.text}
          {/* The frame's one link out of the inbox: it opens the job this
              thread belongs to. */}
          {orderId ? (
            <Link
              to={technicianOrderPath(TECHNICIAN_ROUTES.jobTracking, orderId)}
              className="shrink-0 font-bold text-primary-500 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              عرض
            </Link>
          ) : null}
        </span>
      </li>
    )
  }

  const mine = entry.from === 'me'

  // The technician's own messages sit at the left of the thread and the
  // customer's at the right, as the frame has them. Under `dir="rtl"` the
  // cross-axis start is the right edge, so `items-end` is the left one.
  return (
    <li className={`flex flex-col gap-[4px] ${mine ? 'items-end' : 'items-start'}`}>
      <p
        className={`max-w-[70%] rounded-[12px] px-[24px] py-[24px] text-[16px] leading-[1.5] ${
          mine ? 'bg-primary-500 text-white' : 'bg-card text-text-500'
        }`}
      >
        {entry.text}
      </p>

      {entry.time ? (
        <span className="flex items-center gap-[4px] text-[12px] leading-[1.5] text-text-200">
          {entry.read ? (
            <CheckCheck size={13} aria-hidden="true" className="text-primary-500" />
          ) : null}
          {entry.time}
        </span>
      ) : null}
    </li>
  )
}

/**
 * The technician's inbox (Figma node 22:3776).
 *
 * Two panes: the conversation list on the right and the open thread on the
 * left, which is how the frame lays them out — the list sits at x=1040 and the
 * thread at x=80, and in an RTL row the first child is the rightmost, so the
 * list is written first.
 *
 * Below `lg` the panes stack and the list comes first: on a phone you pick a
 * conversation before you can read one.
 *
 * The composer is deliberately inert. Nothing carries a message anywhere yet,
 * so sending is disabled and says so rather than dropping what someone typed
 * into a thread that never leaves the device.
 */
function TechnicianMessages() {
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id)

  const conversation = findConversation(selectedId)
  const thread = THREADS[conversation.id] ?? []

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[16px] px-[24px] py-[24px] lg:px-[80px]">
        {/* Not in the frame, which gives the inbox no way out. Messaging is a
            detour from the accepted job, so the way back to it is stated rather
            than left to the browser's back button. */}
        {conversation.orderId ? (
          <Link
            to={technicianOrderPath(
              TECHNICIAN_ROUTES.offerAccepted,
              conversation.orderId,
            )}
            className="flex items-center gap-[8px] self-start text-[16px] leading-[1.5] font-bold text-primary-500 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <ArrowRight size={18} aria-hidden="true" />
            العودة إلى تفاصيل المهمة
          </Link>
        ) : null}

        <div className="flex flex-col overflow-hidden rounded-[12px] border border-line bg-white lg:h-[944px] lg:flex-row">
          {/* The list first, so it lands on the right. */}
          <aside className="flex shrink-0 flex-col border-line lg:w-[320px] lg:border-l">
            <div className="flex flex-col gap-[16px] border-b border-line px-[24px] py-[24px]">
              {/* Heading right, compose left. */}
              <div className="flex items-center justify-between gap-[16px]">
                <h1 className="text-[20px] leading-[1.5] font-bold text-text-500">
                  الرسائل
                </h1>

                <button
                  type="button"
                  disabled
                  aria-label="محادثة جديدة"
                  title="بدء محادثة جديدة غير متاح حاليًا"
                  className="cursor-not-allowed text-primary-500 opacity-60"
                >
                  <SquarePen size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-text-200"
                />
                <input
                  type="search"
                  aria-label="البحث في المحادثات"
                  placeholder="البحث في المحادثات"
                  className="h-[40px] w-full rounded-[8px] bg-card pr-[40px] pl-[12px] text-[14px] text-text-500 placeholder-text-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500"
                />
              </div>
            </div>

            <ul className="flex flex-col overflow-y-auto">
              {CONVERSATIONS.map((entry) => (
                <ConversationRow
                  key={entry.id}
                  conversation={entry}
                  active={entry.id === conversation.id}
                  onSelect={setSelectedId}
                />
              ))}
            </ul>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            {/* Partner right, the row of actions left. */}
            <header className="flex items-center justify-between gap-[16px] border-b border-line px-[24px] py-[12px]">
              <div className="flex min-w-0 items-center gap-[12px]">
                <span
                  aria-hidden="true"
                  className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-[18px] font-bold text-primary-700"
                >
                  {conversation.name.charAt(0)}
                </span>

                <div className="flex min-w-0 flex-col gap-[8px] text-right">
                  <p className="truncate text-[16px] leading-[1.3] font-bold text-text-500">
                    {conversation.name}
                  </p>
                  <p className="truncate text-[14px] leading-[1.3] text-text-300">
                    {conversation.subtitle}
                  </p>
                </div>
              </div>

              {/* Call first so it lands to the right of the menu, as the frame
                  has them. Neither is wired: no phone number reaches the client
                  and the menu's entries are screens outside this scope. */}
              <div className="flex shrink-0 items-center gap-[8px]">
                <button
                  type="button"
                  disabled
                  aria-label="اتصال"
                  title="الاتصال غير متاح حاليًا — لا يوفر الخادم رقم العميل بعد."
                  className="flex size-[40px] cursor-not-allowed items-center justify-center rounded-full bg-card text-text-300 opacity-60"
                >
                  <Phone size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  disabled
                  aria-label="خيارات المحادثة"
                  title="خيارات المحادثة غير متاحة حاليًا"
                  className="flex size-[40px] cursor-not-allowed items-center justify-center rounded-full bg-card text-text-300 opacity-60"
                >
                  <MoreVertical size={18} aria-hidden="true" />
                </button>
              </div>
            </header>

            <ul className="flex min-h-[320px] flex-1 flex-col gap-[24px] overflow-y-auto px-[24px] py-[24px]">
              {thread.map((entry) => (
                <ThreadEntry
                  key={entry.id}
                  entry={entry}
                  orderId={conversation.orderId}
                />
              ))}
            </ul>

            {/* Attach right, mic left, the field between them. */}
            <div className="flex items-center gap-[24px] border-t border-line px-[24px] py-[24px]">
              <button
                type="button"
                disabled
                aria-label="إرفاق ملف"
                title="الإرفاق غير متاح حاليًا"
                className="flex size-[48px] shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-card text-text-300 opacity-60"
              >
                <Plus size={20} aria-hidden="true" />
              </button>

              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  disabled
                  aria-label="اكتب رسالة"
                  placeholder="اكتب رسالة"
                  title="إرسال الرسائل غير متاح حاليًا — لا يوفر الخادم خدمة للمحادثات بعد."
                  className="h-[56px] w-full cursor-not-allowed rounded-[9999px] bg-card pr-[24px] pl-[60px] text-[16px] text-text-500 placeholder-text-200"
                />

                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-[4px] flex size-[48px] -translate-y-1/2 items-center justify-center rounded-full text-primary-500 opacity-60"
                >
                  <Send size={19} />
                </span>
              </div>

              <button
                type="button"
                disabled
                aria-label="رسالة صوتية"
                title="الرسائل الصوتية غير متاحة حاليًا"
                className="flex size-[48px] shrink-0 cursor-not-allowed items-center justify-center rounded-full text-text-300 opacity-60"
              >
                <Mic size={19} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianMessages
