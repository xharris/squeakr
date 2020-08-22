import { useState, useEffect } from "react"

export const useFetch = (fn, def) => {
  const [result, setResult] = useState(def)
  const fetch = () => {
    fn().then(setResult)
  }
  return [result, fetch, setResult]
}
