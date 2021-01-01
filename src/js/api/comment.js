import * as api from "."

export const get = id => api.get(`comment/${id}`)

export const add = props =>
  api.post("comment/add", props, { withCredentials: true })

export const update = props =>
  api.patch("comment/update", props, { withCredentials: true })
