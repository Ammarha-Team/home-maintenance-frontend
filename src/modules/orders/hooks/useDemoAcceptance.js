import { useSyncExternalStore } from 'react'

import {
  acceptanceFor,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from '../services/demoOfferAcceptance.js'

// TEMPORARY — DEMO ONLY. Delete alongside `services/demoOfferAcceptance.js`
// once the API can accept an offer.

/** The whole demo store, as one referentially stable object. */
export const useDemoAcceptanceState = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

/**
 * The offer this browser recorded against one request, or null.
 *
 * Null is the normal case and means only that no answer was recorded here — the
 * server has no notion of acceptance either way.
 *
 * @param {string|undefined} requestId
 * @returns {{offerId: string, acceptedAt: string} | null}
 */
export const useDemoAcceptance = (requestId) =>
  acceptanceFor(useDemoAcceptanceState(), requestId)
