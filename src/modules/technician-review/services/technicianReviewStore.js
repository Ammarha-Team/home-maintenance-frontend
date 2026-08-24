// TEMPORARY — DEMO ONLY. Delete this module once the API owns technician review.
//
// The product wants a technician to sit behind an "under review" screen until an
// admin has phoned them and finished the interview. The API has no such state:
// `AccountStatus` is `Active | Suspended`, every new account is created `Active`,
// and nothing on the server ever reads that field when a request arrives. There
// is also no endpoint through which a technician could ask about their own
// account — neither the login payload nor `GET /api/Technician/me/profile`
// carries a status — so there is nothing real to read even if we wanted to.
//
// So the review state lives here, in the browser, and it is worth being blunt
// about what that means:
//
//   * It is NOT security. It hides a screen; it does not protect anything. Every
//     technician endpoint still answers a token from an unreviewed account
//     exactly as it answers an approved one, and clearing site data or calling
//     the API directly walks straight past this file.
//   * It is per-browser. `localStorage` belongs to one origin in one browser, so
//     an admin approving on their machine changes nothing on the technician's.
//     The demo works when both sit in the same browser — separate tabs are fine,
//     and they update each other live.
//   * It knows nothing about accounts it did not see registered. A technician
//     who signed up before this shipped, or on another machine, has no entry
//     here and is let through untouched. Locking out the existing roster on the
//     strength of a missing localStorage key would be worse than not gating.
//
// Replacing it should be a matter of deleting the module and pointing the four
// call sites at the real endpoints. Everything below is keyed on the email
// address because that is the one identifier all three surfaces share: the
// sign-up form collects it, the login payload returns it, and the admin roster
// lists it.

const STORAGE_KEY = 'ammarha.demo.technicianReview'

/** Registered, waiting for an admin to finish the interview. */
export const UNDER_REVIEW = 'under_review'

/** An admin has completed the review. The portal opens. */
export const APPROVED = 'approved'

/**
 * Why an admin suspended an account.
 *
 * The suspension itself is real — `PUT /api/Admin/users/{id}/suspend` — but the
 * API stores only `Active | Suspended` and has nowhere to put a reason, so the
 * reason is kept here beside it. These are labels for a decision a person made,
 * not data about money: nothing in this file knows or claims what anyone owes.
 */
export const SUSPENSION_REASONS = [
  { key: 'unpaid_fees', label: 'رسوم مستحقة غير مسددة' },
  { key: 'quality', label: 'شكاوى على جودة الخدمة' },
  { key: 'documents', label: 'بيانات أو مستندات غير صحيحة' },
  { key: 'other', label: 'سبب آخر' },
]

export const suspensionReasonLabel = (key) =>
  SUSPENSION_REASONS.find((reason) => reason.key === key)?.label ?? null

const EMPTY = Object.freeze({
  version: 1,
  technicians: Object.freeze({}),
  suspensions: Object.freeze({}),
})

// `useSyncExternalStore` compares snapshots by identity and re-renders whenever
// it gets a new one, so re-parsing on every read would spin forever. The raw
// string is kept alongside the parsed value and the parse only runs when the
// string has actually changed.
let cachedRaw = null
let cachedState = EMPTY

const listeners = new Set()

/** The email an entry is filed under. Case and spacing are not identity. */
const keyFor = (email) => String(email ?? '').trim().toLowerCase()

const read = () => {
  let raw = null

  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private browsing and blocked site data both throw on access rather than
    // returning null. No stored review is the same answer as no storage at all.
    return EMPTY
  }

  if (raw === cachedRaw) return cachedState

  cachedRaw = raw

  try {
    const parsed = raw ? JSON.parse(raw) : null

    // `suspensions` arrived after `technicians`, so an entry written by the
    // earlier version has none. Filling it in here means nothing downstream has
    // to guard against it being missing.
    cachedState = parsed?.technicians
      ? { version: 1, technicians: parsed.technicians, suspensions: parsed.suspensions ?? {} }
      : EMPTY
  } catch {
    // A hand-edited or half-written entry is treated as absent, which lets
    // every technician through rather than stranding them on a screen they
    // cannot leave.
    cachedState = EMPTY
  }

  return cachedState
}

const write = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Nothing useful to do if the write is refused — the flow carries on
    // un-gated, which is the same place a fresh browser starts from.
  }

  // Re-read rather than trusting what was handed in, so the cached snapshot is
  // always the thing that is actually stored.
  cachedRaw = null
  read()

  listeners.forEach((listener) => listener())
}

/**
 * Subscribes to review changes, for `useSyncExternalStore`.
 *
 * Two sources feed it: `storage`, which fires in the *other* tabs when this
 * origin writes, and the local listener set, which covers the tab that did the
 * writing — the browser deliberately does not deliver `storage` to itself.
 * Together they are what lets an approval in the admin tab open the portal in
 * the technician tab without either being reloaded.
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
 * One technician's review entry, or null when this browser never saw them
 * register.
 *
 * Null is not "rejected" and not "pending" — it is "unknown", and every caller
 * treats it as a reason to stay out of the way.
 */
export const reviewFor = (state, email) => {
  const key = keyFor(email)
  if (!key) return null

  return state?.technicians?.[key] ?? null
}

/** True only for an account this browser knows is still waiting. */
export const isUnderReview = (state, email) =>
  reviewFor(state, email)?.status === UNDER_REVIEW

/** Files a freshly registered technician as waiting for review. */
export const markUnderReview = (email) => {
  const key = keyFor(email)
  if (!key) return

  const state = read()

  // Registering again with an address that is already approved must not walk
  // the approval backwards.
  if (state.technicians[key]?.status === APPROVED) return

  write({
    ...state,
    technicians: {
      ...state.technicians,
      [key]: { status: UNDER_REVIEW, registeredAt: new Date().toISOString() },
    },
  })
}

/**
 * Records that an admin finished the interview.
 *
 * Writes an entry even for a technician this browser never saw register, so the
 * admin can approve anyone on the roster and have the result stick.
 */
export const markApproved = (email) => {
  const key = keyFor(email)
  if (!key) return

  const state = read()
  const current = state.technicians[key]

  write({
    ...state,
    technicians: {
      ...state.technicians,
      [key]: {
        ...current,
        status: APPROVED,
        approvedAt: new Date().toISOString(),
      },
    },
  })
}

/**
 * Records why an account was suspended, next to the real suspension.
 *
 * Called after `PUT /api/Admin/users/{id}/suspend` succeeds, never instead of
 * it: the account state itself belongs to the API, and this only annotates the
 * decision with something the API has no column for.
 */
export const recordSuspensionReason = (email, reason) => {
  const key = keyFor(email)
  if (!key) return

  const state = read()

  write({
    ...state,
    suspensions: {
      ...state.suspensions,
      [key]: { reason, at: new Date().toISOString() },
    },
  })
}

/** Drops the note when an account is reinstated. */
export const clearSuspensionReason = (email) => {
  const key = keyFor(email)
  if (!key) return

  const state = read()
  if (!state.suspensions[key]) return

  const { [key]: _removed, ...rest } = state.suspensions

  write({ ...state, suspensions: rest })
}

/** The recorded reason for one account, or null when none was written. */
export const suspensionFor = (state, email) => {
  const key = keyFor(email)
  if (!key) return null

  return state?.suspensions?.[key] ?? null
}
