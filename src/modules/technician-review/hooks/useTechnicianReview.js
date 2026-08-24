import { useSyncExternalStore } from 'react'

import { readSession } from '../../auth/services/authSession.js'
import {
  APPROVED,
  UNDER_REVIEW,
  getServerSnapshot,
  getSnapshot,
  reviewFor,
  subscribe,
  suspensionFor,
} from '../services/technicianReviewStore.js'

// TEMPORARY — DEMO ONLY. See `technicianReviewStore.js` for what this is and
// what it deliberately is not.

/**
 * The whole demo review store, kept in step with every tab.
 *
 * `useSyncExternalStore` rather than state plus an effect: the store is written
 * from the admin console, which may be a different tab than the one reading it,
 * and this is the supported way to subscribe to something outside React without
 * tearing during a concurrent render. It is also what makes an approval land on
 * the technician's screen without a refresh.
 */
export const useReviewState = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

/**
 * Where one email address stands, as far as this browser knows.
 *
 * `known` separates "we have never seen this account" from "we have seen it and
 * it is waiting" — the two look the same if you only ask whether the status is
 * approved, and conflating them would gate every technician who registered
 * before this shipped.
 */
export const useReviewFor = (email) => {
  const state = useReviewState()
  const entry = reviewFor(state, email)

  return {
    entry,
    known: entry !== null,
    status: entry?.status ?? null,
    isUnderReview: entry?.status === UNDER_REVIEW,
    isApproved: entry?.status === APPROVED,
  }
}

/**
 * The reason recorded against one account's suspension, or null.
 *
 * Only ever a note about a decision. Whether the account is actually suspended
 * is the API's answer, read from `accountStatus`, not from here.
 */
export const useSuspensionFor = (email) => suspensionFor(useReviewState(), email)

/**
 * The signed-in technician's own standing.
 *
 * The email comes from the saved session, which is where login puts the payload
 * it got back. An account with no email on the session is treated as unknown
 * and let through — better than stranding someone behind a screen keyed on an
 * address we do not have.
 */
export const useSignedInTechnicianReview = () => {
  const email = readSession()?.user?.email ?? null
  const review = useReviewFor(email)

  return { email, ...review }
}
