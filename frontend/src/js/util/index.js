import { useState, useEffect } from "react"

// api

export const useFetch = (fn, type, id) => {
  const [result, setResult] = useState()
  const fetch = () => fn().then(setResult)

  // subscribe to changes
  useEffect(() => {
    if (type) {
      const onFetchOne = e => e.detail.id === id && fetch()

      on(`fetch_one_${type}`, onFetchOne)
      return () => {
        off(`fetch_one_${type}`, onFetchOne)
      }
    }
  }, [])

  // notify subscribers of change
  const notify = diff_id =>
    dispatch(`fetch_one_${type}`, {
      detail: { id: diff_id || id }
    })

  return [result, fetch, notify]
}

export const notify = (type, id) =>
  dispatch(`fetch_one_${type}`, {
    detail: { id }
  })

// event handling

export const dispatch = (...args) =>
  document.dispatchEvent(new CustomEvent(...args))

export const on = (...args) => document.addEventListener(...args)
export const off = (...args) => document.removeEventListener(...args)
