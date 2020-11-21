import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

// api

export const notify = (type, id) =>
  dispatch(`fetch_one_${type}`, {
    detail: { id }
  })

export const useFetch = (fn, type, id) => {
  const [result, setResult] = useState()
  const fetch = (...args) =>
    fn(...args).then(res => {
      setResult(res)
      return res
    })

  // subscribe to changes
  useEffect(() => {
    if (type) {
      const onFetchOne = e =>
        (e.detail.id == null || id == null || e.detail.id === id) && fetch(id)

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
export const useUpdate = ({ fn, type, data: initial_data, key, cooldown }) => {
  const [stateData, setData] = useState(initial_data)
  var data = { ...initial_data }

  const api_call = (res, rej) =>
    fn(data)
      .then(r => {
        notify(type, data[key || "_id"])
        return res(r)
      })
      .catch(rej)

  const update = new_data =>
    new Promise((res, rej) => {
      // update local copy immediately
      data = { ...stateData, ...new_data }
      console.log(data)
      setData({ ...stateData, ...new_data })

      if (!cooldown || cooldown === 0) {
        api_call(res, rej)
      } else if (!api_fns[fn]) {
        // update remote copy when off cooldown
        api_fns[fn] = setTimeout(() => {
          api_call(res, rej)
          api_fns[fn] = null
        }, cooldown)
      }
    })

  return [
    stateData,
    update,
    d => {
      setData(d)
      data = d
    }
  ]
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

export const useQuery = () => {
  const { search } = useLocation()
  const [params, setParams] = useState()

  useEffect(() => {
    setParams(new URLSearchParams(search))
  }, [search])

  return { params }
}

export const useWindowSize = () => {
  const [width, setW] = useState(0)
  const [height, setH] = useState(0)

  const sizeChange = e => {
    setW(window.innerWidth)
    setH(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener("resize", sizeChange)
    return () => {
      window.removeEventListener("resize", sizeChange)
    }
  }, [])

  return [width, height]
}
