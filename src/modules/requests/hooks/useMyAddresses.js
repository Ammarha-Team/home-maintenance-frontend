import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  fetchMyAddresses,
  withDistinctLabels,
} from '../../../shared/services/addressService'

/**
 * The addresses this customer has already saved.
 *
 * Takes no arguments: there is one address book and every caller wants all of
 * it. An empty list is an ordinary answer — a customer filing their first
 * request has nothing saved yet — so it is not treated as an error, and the
 * caller is left to tell the two apart.
 */
export function useMyAddresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // A response that lands after the form is gone would set state on nothing.
  // There are no filters here, so no request can overtake another.
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
      const next = await fetchMyAddresses()
      if (alive.current) setAddresses(next)
    } catch (failure) {
      if (alive.current) {
        setError(failure.message)
        setAddresses([])
      }
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Repeated titles only become ambiguous once they are side by side in a list,
  // so the disambiguation is applied here rather than in the service.
  const labelled = useMemo(() => withDistinctLabels(addresses), [addresses])

  return { addresses: labelled, loading, error, reload: load }
}
