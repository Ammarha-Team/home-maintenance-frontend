import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchServiceCategories } from '../services/serviceRequestService'

/**
 * The service categories a request can be filed under.
 *
 * The list is the API's, not the form's: a request carries the category's id,
 * and only the server knows which ids exist. It takes no arguments and no
 * filters — there is one list and every caller wants all of it.
 */
export function useServiceCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // A response that lands after the component is gone would set state on
  // nothing. The flag settles that; there is no filter here, so no request can
  // overtake another.
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
      const next = await fetchServiceCategories()
      if (alive.current) setCategories(next)
    } catch (failure) {
      if (alive.current) {
        setError(failure.message)
        setCategories([])
      }
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { categories, loading, error, reload: load }
}
