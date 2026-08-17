import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'

import { readSession } from '../../auth/services/authSession.js'

// The live chat connection, and the only one the app opens.
//
// Everything here is module state rather than component state on purpose: React
// mounts, unmounts and — under StrictMode in development — deliberately mounts a
// second time, and a connection owned by a component would be torn down and
// rebuilt each time. One socket per tab, held here, survives all of that.

// Where the hub actually answers.
//
// The integration document gives the endpoint as `/hubs/chat`. The deployed API
// does not serve it: a negotiate against `/hubs/chat` answers 404, while
// `/chatHub` answers 200 with a normal negotiate payload. The live path is the
// one used, since a documented address that is not listening is not an address.
// It is read from the environment so that the day the backend moves the hub to
// the documented path, this is a configuration change and not a code one.
const HUB_PATH = import.meta.env.VITE_CHAT_HUB_PATH || '/chatHub'

// Same reasoning as the HTTP client: in development the call stays on the page's
// own origin so it reaches the dev server's proxy, because the API's CORS
// allowlist names the deployed origin only. A build talks to the API directly.
const hubUrl = () =>
  `${import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL}${HUB_PATH}`

// The events the hub raises, exactly as the document names them. A typo in one
// of these strings is silent — the handler simply never fires — so they are
// written once here and referenced everywhere else.
export const HUB_EVENTS = [
  'ReceiveMessage',
  'MessagesSeen',
  'UserTyping',
  'UserStopTyping',
  'UserOnline',
  'UserOffline',
]

// Not a hub event: the connection's own health, reported through the same
// subscription mechanism so a screen has one thing to listen to.
export const CONNECTION_EVENT = 'ConnectionState'

export const CONNECTION_STATES = {
  connecting: 'connecting',
  connected: 'connected',
  reconnecting: 'reconnecting',
  disconnected: 'disconnected',
}

let connection = null
let starting = null
let holders = 0
let stopTimer = null
let connectionState = CONNECTION_STATES.disconnected

const listeners = new Map()

const emit = (event, payload) => {
  const handlers = listeners.get(event)
  if (!handlers) return

  // Copied before iterating: a handler is allowed to unsubscribe itself, and
  // mutating the set mid-loop would skip its neighbour.
  for (const handler of [...handlers]) handler(payload)
}

/**
 * Listens for one hub event, or for `CONNECTION_EVENT`.
 *
 * @returns {() => void} the unsubscribe, safe to call more than once.
 */
export const onChatEvent = (event, handler) => {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event).add(handler)

  return () => {
    listeners.get(event)?.delete(handler)
  }
}

/** The connection's health right now, for a screen mounting mid-session. */
export const readConnectionState = () => connectionState

const setConnectionState = (next) => {
  if (connectionState === next) return

  connectionState = next
  emit(CONNECTION_EVENT, next)
}

const buildConnection = () => {
  const built = new HubConnectionBuilder()
    .withUrl(hubUrl(), {
      // The one place the token is read. The factory is called again on every
      // reconnect, so a session renewed by the HTTP client's refresh is picked
      // up here without this file knowing anything about how that works.
      accessTokenFactory: () => readSession()?.token ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error)
    .build()

  // Each hub event is forwarded to whoever subscribed. Registered once, on the
  // connection, so the handlers survive a reconnect — SignalR keeps them.
  for (const event of HUB_EVENTS) {
    built.on(event, (payload) => emit(event, payload))
  }

  built.onreconnecting(() => setConnectionState(CONNECTION_STATES.reconnecting))

  // A reconnect is a new connection, and the groups the old one had joined went
  // with it. Reporting `connected` again is what tells a screen to rejoin the
  // conversation it was in.
  built.onreconnected(() => setConnectionState(CONNECTION_STATES.connected))

  built.onclose(() => setConnectionState(CONNECTION_STATES.disconnected))

  return built
}

/**
 * Opens the connection, or joins the one already open.
 *
 * Callers pair this with `releaseChatHub`. Concurrent callers share a single
 * start — the promise is held rather than the work repeated — so a screen that
 * mounts twice in quick succession still ends up with one socket.
 */
export const acquireChatHub = async () => {
  holders += 1

  // A release scheduled a moment ago is cancelled: the connection is wanted
  // again before it was ever closed.
  if (stopTimer) {
    clearTimeout(stopTimer)
    stopTimer = null
  }

  if (!readSession()?.token) {
    throw new Error('لا يمكن فتح المحادثات قبل تسجيل الدخول.')
  }

  connection ??= buildConnection()

  if (connection.state === HubConnectionState.Connected) {
    setConnectionState(CONNECTION_STATES.connected)
    return connection
  }

  starting ??= (async () => {
    setConnectionState(CONNECTION_STATES.connecting)

    try {
      await connection.start()
      setConnectionState(CONNECTION_STATES.connected)
      return connection
    } catch (failure) {
      setConnectionState(CONNECTION_STATES.disconnected)
      throw failure
    } finally {
      starting = null
    }
  })()

  return starting
}

/**
 * Gives up this caller's claim on the connection.
 *
 * The close is deferred rather than immediate. React's development double-mount
 * releases and re-acquires within the same tick, and closing on the spot would
 * mean tearing down a socket that is about to be asked for again — which is
 * exactly the duplicate-connection churn this module exists to avoid.
 */
export const releaseChatHub = () => {
  holders = Math.max(0, holders - 1)
  if (holders > 0 || stopTimer) return

  stopTimer = setTimeout(() => {
    stopTimer = null
    if (holders > 0) return

    const closing = connection
    connection = null
    starting = null
    connectionState = CONNECTION_STATES.disconnected

    closing?.stop().catch(() => {
      // Nothing useful to do about a socket that failed on its way down.
    })
  }, 300)
}

/**
 * Calls a hub method.
 *
 * Anything invoked while the connection is down fails loudly. That is the point:
 * a message the server never received must not be drawn as though it had been.
 */
export const invokeHub = async (method, ...args) => {
  if (!connection || connection.state !== HubConnectionState.Connected) {
    throw new Error('انقطع الاتصال بالمحادثات. حاول مرة أخرى بعد لحظات.')
  }

  return connection.invoke(method, ...args)
}
