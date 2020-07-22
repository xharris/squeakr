import { useState, useEffect, useCallback } from "react"

export const useFetch = (fn, ...args) => {
  const [result, setResult] = useState()
  const fetch = useCallback(() => {
    fn(...args).then(setResult)
  }, [fn])
  useEffect(() => {
    fetch()
  }, [fetch, args])
  return [result, fetch]
}
