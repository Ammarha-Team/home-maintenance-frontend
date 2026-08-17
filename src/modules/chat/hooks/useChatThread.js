import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { readSession } from '../../auth/services/authSession.js'
import {
  CONNECTION_EVENT,
  CONNECTION_STATES,
  acquireChatHub,
  invokeHub,
  onChatEvent,
  readConnectionState,
  releaseChatHub,
} from '../services/chatHub.js'
import {
  fetchConversations,
  fetchMessages,
  formatConversationTime,
  partnerIdOf,
  toMessage,
} from '../services/chatService.js'

// How long a typing indicator survives without being renewed.
//
// `StopTyping` is a message like any other and can be lost — the sender closing
// the tab mid-word never sends one at all. Without an expiry the indicator would
// stay up for the rest of the session, so it lapses on its own and is pushed
// back every time another `UserTyping` arrives.
const TYPING_EXPIRY_MS = 5000

// How long after the last keystroke the customer is considered to have stopped.
//
// This is also what keeps typing off the wire: one `Typing` goes out when a
// burst begins and one `StopTyping` when it ends, however many keys were pressed
// in between.
const TYPING_IDLE_MS = 2000

const withoutId = (set, id) => {
  if (!set.has(id)) return set

  const next = new Set(set)
  next.delete(id)
  return next
}

const withId = (set, id) => {
  if (set.has(id)) return set

  const next = new Set(set)
  next.add(id)
  return next
}

/**
 * One side of the live chat — whichever side is signed in.
 *
 * The screen keeps no chat state of its own: it renders what this returns and
 * calls back in. The perspective is decided in exactly one place,
 * `currentUserId`, and every "is this mine?" question is answered by comparing
 * a message's `senderId` against it. Nothing here knows about customers or
 * technicians as such, which is why both inboxes share it and neither can
 * quietly acquire the other's view.
 */
export function useChatThread() {
  const currentUserId = useMemo(() => readSession()?.user?.id ?? null, [])

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set())
  const [typingUserIds, setTypingUserIds] = useState(() => new Set())
  const [connectionState, setConnectionState] = useState(readConnectionState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sendError, setSendError] = useState(null)

  // Read by the hub handlers, which are registered once and would otherwise
  // close over the first render's values forever.
  const activeIdRef = useRef(null)
  const conversationsRef = useRef([])
  const typingTimers = useRef(new Map())
  const outgoingTyping = useRef({ sent: false, timer: null })

  activeIdRef.current = activeId
  conversationsRef.current = conversations

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId],
  )

  const loadConversations = useCallback(async () => {
    const rows = await fetchConversations()
    setConversations(rows)

    // The first row opens by default, matching how the screen has always
    // behaved. Only when nothing is open yet — reloading the list must never
    // move someone out of the conversation they are reading.
    setActiveId((current) => current ?? rows[0]?.id ?? null)

    return rows
  }, [])

  // Opening the connection and loading the list. One effect, because a list
  // loaded without a live connection would go stale the moment it was drawn.
  useEffect(() => {
    let cancelled = false

    const open = async () => {
      setLoading(true)
      setError(null)

      try {
        await acquireChatHub()
        await loadConversations()
      } catch (failure) {
        if (!cancelled) setError(failure)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    open()

    return () => {
      cancelled = true
      releaseChatHub()
    }
  }, [loadConversations])

  // The conversation on screen: its history, its group membership, and the read
  // receipt that opening it implies.
  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return undefined
    }

    let cancelled = false

    const open = async () => {
      try {
        const history = await fetchMessages(activeId, currentUserId)
        if (cancelled) return

        setMessages(history)

        // Joining is what makes the typing indicators arrive; marking as read is
        // what opening the conversation means. Neither is worth failing the
        // screen over — a refusal is left to the connection state to explain.
        await invokeHub('JoinConversation', activeId).catch(() => {})
        await invokeHub('MarkAsRead', activeId).catch(() => {})

        if (cancelled) return

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === activeId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
        )
      } catch (failure) {
        if (!cancelled) setError(failure)
      }
    }

    open()

    return () => {
      cancelled = true
    }
  }, [activeId, currentUserId])

  // Everything the hub has to say. Registered once: the handlers read the refs
  // above rather than the render they were created in.
  useEffect(() => {
    if (!currentUserId) return undefined

    const timers = typingTimers.current

    const markTyping = (userId) => {
      setTypingUserIds((prev) => withId(prev, userId))

      clearTimeout(timers.get(userId))
      timers.set(
        userId,
        setTimeout(() => {
          timers.delete(userId)
          setTypingUserIds((prev) => withoutId(prev, userId))
        }, TYPING_EXPIRY_MS),
      )
    }

    const clearTyping = (userId) => {
      clearTimeout(timers.get(userId))
      timers.delete(userId)
      setTypingUserIds((prev) => withoutId(prev, userId))
    }

    const onReceive = (dto) => {
      const partnerId = partnerIdOf(dto, currentUserId)
      const conversation = conversationsRef.current.find(
        (row) => row.otherUserId === partnerId,
      )

      // A message from someone the list has never mentioned means a brand new
      // conversation, and the server is the only party that knows its id.
      if (!conversation) {
        loadConversations().catch(() => {})
        return
      }

      const isActive = conversation.id === activeIdRef.current
      const isMine = dto.senderId === currentUserId

      setConversations((prev) =>
        prev.map((row) =>
          row.id === conversation.id
            ? {
                ...row,
                lastMessage: dto.content ?? '',
                lastMessageDate: dto.createdAt ?? null,
                time: formatConversationTime(dto.createdAt),
                unreadCount:
                  isActive || isMine ? row.unreadCount : row.unreadCount + 1,
              }
            : row,
        ),
      )

      clearTyping(dto.senderId)

      if (!isActive) return

      // The hub echoes a message to its sender as well as its receiver, and a
      // reconnect can replay one. Keying on the server's id means neither shows
      // up twice.
      setMessages((prev) =>
        prev.some((message) => message.id === dto.id)
          ? prev
          : [...prev, toMessage(dto, currentUserId)],
      )

      // Arriving in a conversation the customer is looking at is the same as
      // having read it.
      if (!isMine) {
        invokeHub('MarkAsRead', conversation.id).catch(() => {})
      }
    }

    // The event names only a conversation, not who did the reading, so the
    // message list is re-read rather than guessed at: `isSeen` per message is
    // the server's answer and it is one request away.
    const onSeen = (conversationId) => {
      if (conversationId !== activeIdRef.current) return

      fetchMessages(conversationId, currentUserId)
        .then(setMessages)
        .catch(() => {})
    }

    const onConnection = (state) => {
      setConnectionState(state)

      // A reconnect is a new connection and the old one's groups went with it,
      // so the open conversation has to be rejoined — and whatever was missed
      // while the socket was down is picked up from the API.
      if (state !== CONNECTION_STATES.connected) return

      const openId = activeIdRef.current
      if (!openId) return

      invokeHub('JoinConversation', openId).catch(() => {})
      loadConversations().catch(() => {})
      fetchMessages(openId, currentUserId).then(setMessages).catch(() => {})
    }

    const unsubscribes = [
      onChatEvent('ReceiveMessage', onReceive),
      onChatEvent('MessagesSeen', onSeen),
      onChatEvent('UserTyping', markTyping),
      onChatEvent('UserStopTyping', clearTyping),
      onChatEvent('UserOnline', (userId) =>
        setOnlineUserIds((prev) => withId(prev, userId)),
      ),
      onChatEvent('UserOffline', (userId) =>
        setOnlineUserIds((prev) => withoutId(prev, userId)),
      ),
      onChatEvent(CONNECTION_EVENT, onConnection),
    ]

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe()
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }, [currentUserId, loadConversations])

  const stopTyping = useCallback(() => {
    const outgoing = outgoingTyping.current

    clearTimeout(outgoing.timer)
    outgoing.timer = null

    if (!outgoing.sent) return

    outgoing.sent = false

    const openId = activeIdRef.current
    if (openId) invokeHub('StopTyping', openId).catch(() => {})
  }, [])

  /**
   * Announces that the customer is writing.
   *
   * Called on every keystroke and deliberately does almost nothing on most of
   * them: the hub hears one `Typing` at the start of a burst and one
   * `StopTyping` once the keyboard has been quiet, whatever was typed between.
   */
  const notifyTyping = useCallback(() => {
    const openId = activeIdRef.current
    if (!openId) return

    const outgoing = outgoingTyping.current

    if (!outgoing.sent) {
      outgoing.sent = true

      invokeHub('Typing', openId).catch(() => {
        outgoing.sent = false
      })
    }

    clearTimeout(outgoing.timer)
    outgoing.timer = setTimeout(stopTyping, TYPING_IDLE_MS)
  }, [stopTyping])

  // Leaving a conversation — by opening another or by leaving the screen — ends
  // any burst that was still in progress, so the other side is not left watching
  // an indicator for a conversation nobody is in.
  useEffect(() => stopTyping, [activeId, stopTyping])

  /**
   * Sends what the customer typed.
   *
   * Nothing is drawn optimistically. The hub echoes the stored message back to
   * its sender, so the bubble that appears is the one the server actually kept,
   * with its own id and timestamp — and a send that fails leaves no bubble
   * claiming otherwise.
   */
  const sendMessage = useCallback(
    async (text) => {
      const body = text.trim()
      const conversation = conversationsRef.current.find(
        (row) => row.id === activeIdRef.current,
      )

      if (!body || !conversation) return false

      setSendError(null)
      stopTyping()

      try {
        await invokeHub(
          'SendMessage',
          conversation.otherUserId,
          body,
          null,
          null,
          null,
        )

        return true
      } catch (failure) {
        setSendError(failure)
        return false
      }
    },
    [stopTyping],
  )

  const selectConversation = useCallback((conversationId) => {
    setActiveId(conversationId)
  }, [])

  const partnerId = activeConversation?.otherUserId ?? null

  return {
    currentUserId,
    conversations,
    activeConversation,
    activeId,
    messages,
    loading,
    error,
    sendError,
    connectionState,
    isPartnerOnline: partnerId ? onlineUserIds.has(partnerId) : false,
    isPartnerTyping: partnerId ? typingUserIds.has(partnerId) : false,
    isOnline: (userId) => (userId ? onlineUserIds.has(userId) : false),
    selectConversation,
    sendMessage,
    notifyTyping,
  }
}

export default useChatThread
