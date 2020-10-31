import * as api from "."

export const add = props => api.post("user/add", props)
export const get = ids => api.post("user/get", { ids: [].concat(ids) })
export const login = props => api.post("user/login", props)
export const verifyToken = data => api.post("user/verify", data)
