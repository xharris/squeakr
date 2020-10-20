import * as api from "."

export const add = props => api.post("user/add", props)
export const login = props => api.post("user/login", props)
export const verifyToken = data => api.post("user/verify", data)
