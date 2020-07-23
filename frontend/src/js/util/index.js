import { useState, useEffect } from "react"

export const useFetch = fn => {
  const [result, setResult] = useState()
  const fetch = () => {
    fn().then(setResult)
  }
  useEffect(() => {
    fetch()
  }, [])
  return [result, fetch]
}
