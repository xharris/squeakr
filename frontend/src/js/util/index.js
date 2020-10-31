import { useState, useEffect } from "react"

// api

export const notify = (type, id) =>
  dispatch(`fetch_one_${type}`, {
    detail: { id }
  })

export const useFetch = (fn, type, id) => {
  const [result, setResult] = useState()
  const fetch = () => fn().then(setResult)

  // subscribe to changes
  useEffect(() => {
    if (type) {
      const onFetchOne = e =>
        (e.detail.id == null || id == null || e.detail.id === id) && fetch()

      on(`fetch_one_${type}`, onFetchOne)
      return () => {
        off(`fetch_one_${type}`, onFetchOne)
      }
    }
  }, [])

  // notify subscribers of change
  const notify_type = diff_id => type && notify(type, diff_id || id)

  return [result, fetch, notify_type]
}

// can be used on a simple api.update(id, data) function
const api_fns = {}
export const useApiUpdate = (fn, cooldown, initial_data) => {
  const [stateData, setData] = useState(initial_data)
  var data = { ...initial_data }

  const update = new_data => {
    // update local copy immediately
    data = { ...data, ...new_data }
    setData(data)

    if (cooldown === 0) {
      fn(data)
    } else if (!api_fns[fn]) {
      // update remote copy when off cooldown
      api_fns[fn] = setTimeout(() => {
        fn(data)
        api_fns[fn] = null
      }, cooldown)
    }
  }

  return [stateData, update]
}

// event handling

export const dispatch = (...args) =>
  document.dispatchEvent(new CustomEvent(...args))

export const on = (...args) => document.addEventListener(...args)
export const off = (...args) => document.removeEventListener(...args)

// misc

export const cooldown = (time, fn) => {
  var can_call = true

  const wrapper = (...args) => {
    if (can_call) {
      // not on cooldown
      fn(...args)
      can_call = false
      setTimeout(() => {}, time)
    }
  }
}
