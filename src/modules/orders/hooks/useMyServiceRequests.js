import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchMyServiceRequests } from '../../requests/services/serviceRequestService'

/**
 * The signed-in customer's service requests.
 *
 * Both filters are the server's own — `status` and `search` are query
 * parameters on GET /api/service-requests — so filtering is asked of the API
 * rather than done over a page-sized slice of it. That also means a changed
 * filter is a new request, which is why the effect depends on both.
 *
 * @param {{status?: number, search?: string}} filters
 */
export function useMyServiceRequests({ status, search } = {}) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // A response that lands after the component is gone would set state on
  // nothing, and a slow first request finishing after a faster second one would
  // show the wrong list. The counter settles both: only the newest wins.
  const alive = useRef(true)
  const latest = useRef(0)

  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  const load = useCallback(async () => {
    const ticket = ++latest.current

    setLoading(true)
    setError(null)

    try {
      const next = await fetchMyServiceRequests({ status, search })
      if (alive.current && ticket === latest.current) setRequests(next)
    } catch (failure) {
      // A 401 never reaches here: the shared client renews the token once and,
      // failing that, ends the session and sends the user to the login screen.
      if (alive.current && ticket === latest.current) {
        setError(failure.message)
        setRequests([])
      }
    } finally {
      if (alive.current && ticket === latest.current) setLoading(false)
    }
  }, [status, search])

  useEffect(() => {
    load()
  }, [load])

  return { requests, loading, error, reload: load }
}
