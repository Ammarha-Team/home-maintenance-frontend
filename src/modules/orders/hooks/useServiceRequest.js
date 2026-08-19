import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchServiceRequestById } from '../../requests/services/serviceRequestService'

/**
 * One of the signed-in customer's service requests, by id.
 *
 * The sibling of `useMyServiceRequests`, for the screens that open a single
 * request rather than list them. A missing id is not an error and not a
 * request: the hook simply reports nothing to show.
 *
 * @param {string|undefined} id
 */
export function useServiceRequest(id) {
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)

  // A response that lands after the component is gone would set state on
  // nothing, and a slow first request finishing after a faster second one would
  // show the wrong record. The counter settles both: only the newest wins.
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
      const next = await fetchServiceRequestById(id)
      if (alive.current && ticket === latest.current) setRequest(next)
    } catch (failure) {
      // A 401 never reaches here: the shared client renews the token once and,
      // failing that, ends the session and sends the user to the login screen.
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
