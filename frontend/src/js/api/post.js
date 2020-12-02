import * as api from "."

export const add = props =>
  api.post("post/add", props, { withCredentials: true })

export const update = props =>
  api.put("post/update", props, { withCredentials: true })

export const getTag = tags => api.post("post/tag", { tags: [].concat(tags) })
export const getUser = id => api.get(`post/user/${id}`)
export const get = id => api.get(`post/${id}`, { id }).then(res => res.doc)
export const preview = data =>
  api.post("post/preview", data).then(res => res.data)

export const feed = () => api.post("post/feed", {}, { withCredentials: true })
