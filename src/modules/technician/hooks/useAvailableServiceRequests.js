import { useCallback, useEffect, useRef, useState } from 'react'

import {
  fetchAvailableServiceRequestById,
  fetchAvailableServiceRequests,
} from '../../requests/services/serviceRequestService'

/**
 * The open service requests a technician may bid on.
 *
 * The endpoint is technician-only — a client token is refused with 403 — and it
 * reads the caller from the bearer token, so nothing here identifies the
 * technician.
 *
 * It takes no filters. The API offers two, and neither fits the board: `search`
 * matches the English category name, which an Arabic term never hits, and
 * `categoryId` takes a single category while the filter rail is a multi-select.
 * The board filters the returned list itself.
 */
export function useAvailableServiceRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // A response that lands after the component is gone would set state on
  // nothing. The flag settles that; with no filters, no request can overtake
  // another.
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const next = await fetchAvailableServiceRequests()
      if (alive.current) setRequests(next)
    } catch (failure) {
      // A 401 never reaches here: the shared client renews the token once and,
      // failing that, ends the session and sends the user to the login screen.
      if (alive.current) {
        setError(failure.message)
        setRequests([])
      }
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { requests, loading, error, reload: load }
}

/**
 * One open request, for the technician deciding whether to bid on it.
 *
 * The sibling of the list above, for the screen that opens a single request. A
 * missing id is not an error and not a request: the hook reports nothing to
 * show, and the page says so.
 *
 * @param {string|undefined} id
 */
export function useAvailableServiceRequest(id) {
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)

  // As above, plus a ticket: the id can change while a response is in flight,
  // and only the newest one should win.
  const alive = useRef(true)
  const latest = useRef(0)

  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  const load = useCallback(async () => {
    if (!id) {
      setRequest(null)
      setLoading(false)
      setError(null)
      return
    }

    const ticket = ++latest.current

    setLoading(true)
    setError(null)

    try {
      const next = await fetchAvailableServiceRequestById(id)
      if (alive.current && ticket === latest.current) setRequest(next)
    } catch (failure) {
      if (alive.current && ticket === latest.current) {
        setError(failure.message)
        setRequest(null)
      }
    } finally {
      if (alive.current && ticket === latest.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { request, loading, error, reload: load }
}
