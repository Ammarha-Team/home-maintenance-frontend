import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Loads something from the admin API and reports where it got to.
 *
 * Every console screen wants the same three answers — is it still coming, did
 * it fail, and what came back — so they are answered once here rather than four
 * times over in four pages.
 *
 * `load` must be stable across renders, or the effect that calls it will run on
 * every one: wrap it in `useCallback` at the call site, or define it outside the
 * component when it takes nothing from props.
 *
 * A screen left before its answer arrives must not be written to, and a slow
 * first request must not overwrite a faster second one. A request counter
 * settles both: only the newest request is allowed to set state.
 */
export function useAdminResource(load, { skip = false } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!skip)

  const latest = useRef(0)

  const run = useCallback(async () => {
    if (skip) return

    const ticket = (latest.current += 1)

    setLoading(true)
    setError(null)

    try {
      const result = await load()
      if (latest.current === ticket) setData(result)
    } catch (failure) {
      if (latest.current === ticket) {
        setData(null)
        setError(failure)
      }
    } finally {
      if (latest.current === ticket) setLoading(false)
    }
  }, [load, skip])

  useEffect(() => {
    run()

    // Anything still in flight when this unmounts or reruns is disowned by
    // moving the counter past its ticket.
    return () => {
      latest.current += 1
    }
  }, [run])

  return { data, error, loading, reload: run }
}

export default useAdminResource
