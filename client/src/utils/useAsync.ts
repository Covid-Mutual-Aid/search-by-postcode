import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { Request } from './api'

export const useFetch = <T extends any>(
  fn?: (req: Request, args?: any) => Promise<T>,
  immediate?: boolean
) => {
  const request = useRequest()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T>()
  const isMounted = useRef(true)

  const retry = useCallback(
    (args?: any) => {
      if (!fn) return
      setIsLoading(true)
      setError(null)
      fn(request, args)
        .then((x) => {
          if (!isMounted.current) return
          setIsLoading(false)
          if (!x) return
          else if (x.error) return setError(x.error)
          else if (x.message) return setError(x.message)
          return setData(x)
        })
        .catch((err) => {
          console.log(err)
          if (!isMounted.current) return
          setIsLoading(false)
          setError(err.message || err)
        })
    },
    [fn, request]
  )

  useEffect(() => {
    isMounted.current = true
    if (fn && immediate) retry()
    return () => void (isMounted.current = false)
  }, [fn, immediate, retry])

  return useMemo(() => ({ data, isLoading, error, retry }), [data, isLoading, error])
}
