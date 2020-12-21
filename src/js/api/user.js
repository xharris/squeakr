import * as api from "."
import { useApi } from "util"

export const useTheme = fn_notify =>
  useApi(
    "user/theme",
    user_id => api.get(`user/theme/${user_id}`).then(res => res._doc.theme),
    props => api.put("user/theme/update", props, { withCredentials: true }),
    fn_notify
  )

export const get = values =>
  api.post("user/get", { values: [].concat(values), key: "username" })
export const login = ({ id, pwd, remember }) =>
  api.post(
    "user/login",
    { remember },
    { withCredentials: true, auth: { username: id, password: pwd } }
  )
export const logout = () =>
  api.post("user/logout", {}, { withCredentials: true })
export const add = props => api.post("user/add", props)
export const verify = () =>
  api.post("user/verify", {}, { withCredentials: true })
