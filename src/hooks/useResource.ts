import { useCallback, useEffect, useRef, useState } from 'react'

type State<T> = { data: T | undefined; error: Error | null; loading: boolean }

/**
 * Loads data and reloads it on demand. A burst of refetch() calls (e.g. 30
 * votes landing at once) runs at most one request plus one follow-up.
 */
export function useResource<T>(fetcher: () => Promise<T>, deps: unknown[], enabled = true) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: null, loading: enabled })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const inFlight = useRef(false)
  const queued = useRef(false)
  const generation = useRef(0)

  const refetch = useCallback(async (): Promise<void> => {
    if (inFlight.current) {
      queued.current = true
      return
    }
    inFlight.current = true
    const gen = generation.current
    try {
      const data = await fetcherRef.current()
      if (gen === generation.current) setState({ data, error: null, loading: false })
    } catch (e) {
      if (gen === generation.current) setState((s) => ({ ...s, error: e as Error, loading: false }))
    } finally {
      if (gen === generation.current) {
        inFlight.current = false
        if (queued.current) {
          queued.current = false
          void refetch()
        }
      }
    }
  }, [])

  useEffect(() => {
    generation.current++
    inFlight.current = false
    queued.current = false
    if (!enabled) {
      setState({ data: undefined, error: null, loading: false })
      return
    }
    setState((s) => ({ data: s.data, error: null, loading: true }))
    void refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetch, ...deps])

  const setData = useCallback((update: (prev: T | undefined) => T) => {
    setState((s) => ({ ...s, data: update(s.data) }))
  }, [])

  return { ...state, refetch, setData }
}
