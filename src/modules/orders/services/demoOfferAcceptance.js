// TEMPORARY — DEMO ONLY. Delete this module once the API can accept an offer.
//
// The customer journey has a hole in the middle of it. A technician can send a
// real offer and the customer can read it back, but there is no endpoint that
// takes the customer's answer: the whole API surface is 33 paths and none of
// them accepts an offer, assigns a technician, or moves a request past
// `PendingOffers`. `ServiceRequestStatus` itself only has PendingOffers,
// Assigned, InProgress, Completed and Cancelled — there is no "on the way" or
// "arrived" for a tracking screen to show even if something could set them.
//
// So that the journey can be walked end to end in a demo, this remembers which
// offer the customer pressed accept on. Be clear about what that is and is not:
//
//   * Nothing is sent. Pressing accept makes no request, and the service
//     request on the server stays exactly as it was — still PendingOffers,
//     still unassigned. The technician is not told anything.
//   * It is per-browser. `localStorage` belongs to one origin in one browser,
//     so an acceptance here is invisible to the technician's session and to the
//     same customer on another device.
//   * It stores an id, not a technician. Only `offerId` is kept, and the
//     tracking screen looks that id up in the offers the API returns for the
//     request. Every name, picture, rating and price on that screen is
//     therefore real server data — this file just records which of the real
//     offers was chosen.
//
// Replacing it should be deleting the module and reading the assigned
// technician off the request instead.

const STORAGE_KEY = 'ammarha.demo.offerAcceptance'

const EMPTY = Object.freeze({ version: 1, accepted: Object.freeze({}) })

// `useSyncExternalStore` compares snapshots by identity and re-renders whenever
// it gets a new one, so re-parsing on every read would spin forever. The raw
// string is kept beside the parsed value and the parse only runs when the
// string has actually changed.
let cachedRaw = null
let cachedState = EMPTY

const listeners = new Set()

const keyFor = (id) => String(id ?? '').trim()

const read = () => {
  let raw = null

  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private browsing and blocked site data both throw on access rather than
    // returning null. No stored acceptance is the same answer as no storage.
    return EMPTY
  }

  if (raw === cachedRaw) return cachedState

  cachedRaw = raw

  try {
    const parsed = raw ? JSON.parse(raw) : null
    cachedState = parsed?.accepted
      ? { version: 1, accepted: parsed.accepted }
      : EMPTY
  } catch {
    // A hand-edited or half-written entry is treated as absent, which shows the
    // customer the offers list again rather than stranding them on a tracking
    // screen with nothing behind it.
    cachedState = EMPTY
  }

  return cachedState
}

const write = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Nothing useful to do if the write is refused. The journey carries on
    // un-recorded, which is where a fresh browser starts from anyway.
  }

  // Re-read rather than trusting what was handed in, so the cached snapshot is
  // always the thing that is actually stored.
  cachedRaw = null
  read()

  listeners.forEach((listener) => listener())
}

/**
 * Subscribes to acceptance changes, for `useSyncExternalStore`.
 *
 * Two sources feed it: `storage`, which fires in the *other* tabs of this
 * origin, and the local listener set, which covers the tab that did the writing
 * — the browser deliberately does not deliver `storage` to itself.
 */
export const subscribe = (listener) => {
  listeners.add(listener)

  const onStorage = (event) => {
    // `key` is null when the whole store was cleared, which is as much a change
    // as a write to our own key.
    if (event.key === STORAGE_KEY || event.key === null) {
      cachedRaw = null
      listener()
    }
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Every entry, as one stable object. The snapshot for `useSyncExternalStore`. */
export const getSnapshot = () => read()

/** No storage exists before hydration; an empty store is the honest answer. */
export const getServerSnapshot = () => EMPTY

/**
 * The offer this browser recorded for one request, or null.
 *
 * Null means "no answer recorded here" — not "declined", and not anything the
 * server would recognise either way.
 */
export const acceptanceFor = (state, requestId) => {
  const key = keyFor(requestId)
  if (!key) return null

  return state?.accepted?.[key] ?? null
}

/** Records which offer the customer pressed accept on. Sends nothing. */
export const recordAcceptance = (requestId, offerId) => {
  const key = keyFor(requestId)
  const offer = keyFor(offerId)
  if (!key || !offer) return

  const state = read()

  write({
    ...state,
    accepted: {
      ...state.accepted,
      [key]: { offerId: offer, acceptedAt: new Date().toISOString() },
    },
  })
}

/** Forgets the recorded answer, so the offers list is live again. */
export const clearAcceptance = (requestId) => {
  const key = keyFor(requestId)
  if (!key) return

  const state = read()
  if (!state.accepted[key]) return

  const { [key]: _removed, ...rest } = state.accepted

  write({ ...state, accepted: rest })
}
