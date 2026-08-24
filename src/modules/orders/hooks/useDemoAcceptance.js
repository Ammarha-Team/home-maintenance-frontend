import { useSyncExternalStore } from 'react'

import {
  acceptanceFor,
  getServerSnapshot,
  getSnapshot,
  nextStageOf,
  stageOf,
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

/**
 * Where the demo journey stands for one request.
 *
 * `next` is the only step the UI is allowed to offer, which is what keeps the
 * buttons in order and stops the flow being walked backwards.
 *
 * @param {string|undefined} requestId
 * @returns {{stage: string, next: string|null, review: object|null}}
 */
export const useDemoStage = (requestId) => {
  const state = useDemoAcceptanceState()

  return {
    stage: stageOf(state, requestId),
    next: nextStageOf(state, requestId),
    review: acceptanceFor(state, requestId)?.review ?? null,
  }
}
