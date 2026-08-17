import api from '../../../shared/services/api.js'

// The chat's HTTP half: the conversation list and the history of one
// conversation. Everything that happens live — new messages, read receipts,
// typing, presence — arrives over the hub instead, in `chatHub.js`.
//
// Swagger documents both endpoints as `200: OK` with no schema, so the shapes
// below were read off real responses rather than guessed:
//
//   GET /api/Chat/getAll
//     [{ id, otherUserId, otherUserName, lastMessage, lastMessageDate,
//        unreadCount }]
//
//   GET /api/Chat/conversationId?conversationId=<guid>
//     [{ id, senderId, receiverId, content, filePath, fileName, fileType,
//        createdAt, isSeen }]
//
// The second shape is also exactly what `ReceiveMessage` carries, which is why
// one reader serves both.

/**
 * Turns a timestamp from the API into a Date.
 *
 * The two sources disagree about zones. The hub sends `...5104258Z`; the same
 * message fetched over HTTP comes back as `...5104258`, with no designator at
 * all. A bare string like that is read as local time by the browser, so the
 * history would drift by the offset of whoever is reading it — while the message
 * that just arrived over the socket, saying the same instant, would not.
 * Appending the `Z` treats the API's clock as UTC, which is what it is.
 */
const readInstant = (value) => {
  if (!value) return null

  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
  const date = new Date(hasZone ? value : `${value}Z`)

  return Number.isNaN(date.getTime()) ? null : date
}

const TIME_FORMAT = { hour: '2-digit', minute: '2-digit' }
const DATE_FORMAT = { day: 'numeric', month: 'long' }

/** The clock time a bubble is stamped with — "09:42 ص". */
export const formatMessageTime = (value) => {
  const date = readInstant(value)
  return date ? date.toLocaleTimeString('ar-EG', TIME_FORMAT) : ''
}

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

const DAY = 24 * 60 * 60 * 1000

/**
 * The stamp beside a row in the conversation list.
 *
 * Today's messages show a clock, yesterday's say so, and anything older gives
 * the date — the three forms the list was designed around.
 */
export const formatConversationTime = (value) => {
  const date = readInstant(value)
  if (!date) return ''

  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY)

  if (days <= 0) return date.toLocaleTimeString('ar-EG', TIME_FORMAT)
  if (days === 1) return 'أمس'

  return date.toLocaleDateString('ar-EG', DATE_FORMAT)
}

/**
 * The heading that separates one day of a thread from the next.
 *
 * The technician's inbox draws these between messages. They are derived from
 * the timestamps the messages already carry rather than stored anywhere, so a
 * thread read at midnight relabels itself without the server being asked.
 */
export const formatDayLabel = (value) => {
  const date = readInstant(value)
  if (!date) return ''

  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY)

  if (days <= 0) return 'اليوم'
  if (days === 1) return 'أمس'

  return date.toLocaleDateString('ar-EG', DATE_FORMAT)
}

/**
 * A conversation as the sidebar draws it.
 *
 * `otherUserName` is whoever the signed-in user is talking to, so for a customer
 * it is the technician. The API sends no picture and no trade alongside it, so
 * the avatar falls back to the one the design already ships and the subtitle is
 * left empty rather than filled with a guess.
 */
export const toConversation = (dto) => ({
  id: dto.id,
  otherUserId: dto.otherUserId,
  name: dto.otherUserName || '',
  lastMessage: dto.lastMessage || '',
  lastMessageDate: dto.lastMessageDate ?? null,
  time: formatConversationTime(dto.lastMessageDate),
  unreadCount: dto.unreadCount ?? 0,
})

/**
 * A message as a bubble needs it.
 *
 * `mine` is the whole of the customer/technician distinction: the API says who
 * sent a message, and the side it is drawn on follows from comparing that with
 * the signed-in user. Nothing about the message itself says "customer" or
 * "technician", which is why the same reader is correct in either portal.
 */
export const toMessage = (dto, currentUserId) => ({
  id: dto.id,
  senderId: dto.senderId,
  receiverId: dto.receiverId,
  mine: dto.senderId === currentUserId,
  text: dto.content ?? '',
  filePath: dto.filePath ?? null,
  fileName: dto.fileName ?? null,
  fileType: dto.fileType ?? null,
  createdAt: dto.createdAt ?? null,
  time: formatMessageTime(dto.createdAt),
  seen: Boolean(dto.isSeen),
})

/**
 * The other party in a message, whichever end of it the reader is on.
 *
 * A message carries no conversation id — only a sender and a receiver — so this
 * is how one that arrives is matched to the row it belongs to: the conversation
 * with this person.
 */
export const partnerIdOf = (dto, currentUserId) =>
  dto.senderId === currentUserId ? dto.receiverId : dto.senderId

/** GET /api/Chat/getAll — every conversation the signed-in user is part of. */
export const fetchConversations = async () => {
  const data = await api.get('/api/Chat/getAll')

  return (Array.isArray(data) ? data : []).map(toConversation)
}

/** GET /api/Chat/conversationId — the full history of one conversation. */
export const fetchMessages = async (conversationId, currentUserId) => {
  const data = await api.get('/api/Chat/conversationId', {
    params: { conversationId },
  })

  return (Array.isArray(data) ? data : []).map((dto) =>
    toMessage(dto, currentUserId),
  )
}
