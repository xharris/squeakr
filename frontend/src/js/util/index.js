import { useState, useEffect } from "react"

// api

export const useFetch = (fn, fetchid, id) => {
  const [result, setResult] = useState()
  const fetch = () => fn().then(setResult)

  // subscribe to changes
  useEffect(() => {
    if (fetchid) {
      const onFetchOne = e => e.detail.id === id && fetch()

      on(`fetch_one_${fetchid}`, onFetchOne)
      return () => {
        off(`fetch_one_${fetchid}`, onFetchOne)
      }
    }
  }, [])

  // notify subscribers of change
  const notify = diff_id =>
    dispatch(`fetch_one_${fetchid}`, {
      detail: { id: diff_id || id }
    })

  return [result, fetch, notify]
}

// event handling

export const dispatch = (...args) =>
  document.dispatchEvent(new CustomEvent(...args))

export const on = (...args) => document.addEventListener(...args)
export const off = (...args) => document.removeEventListener(...args)
