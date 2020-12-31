import * as api from "."

export const add = props =>
  api.post("post/add", props, { withCredentials: true })

export const update = props =>
  api.patch("post/update", props, { withCredentials: true })

export const del = id =>
  api.del("post/delete", { data: { id }, withCredentials: true })

export const getTag = tags => api.post("post/tag", { tags: [].concat(tags) })
export const getUser = id => api.get(`post/user/${id}`)
export const get = (id, config) =>
  api.get(`post/${id}`, config).then(res => res.data.doc)

export const feed = () => api.post("post/feed", {}, { withCredentials: true })

export const query = (body, config) =>
  api.post("post/query", body, { ...config, withCredentials: true })

export const view = id =>
  api.put(`post/viewed/${id}`, {}, { withCredentials: true })
