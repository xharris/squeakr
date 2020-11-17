import * as api from "."
import { useUpdate } from "util"
import { useAuthContext } from "component/auth"

export const add = props => api.post("user/add", props)
export const get = values =>
  api.post("user/get", { values: [].concat(values), key: "username" })
export const login = ({ id, pwd }) =>
  api.post(
    "user/login",
    {},
    { withCredentials: true, auth: { username: id, password: pwd } }
  )
export const logout = () =>
  api.post("user/logout", {}, { withCredentials: true })
export const verify = () =>
  api.post("user/verify", {}, { withCredentials: true })

export const useTheme = init_data => {
  const { user } = useAuthContext()
  return useUpdate({
    fn: d => updateTheme({ ...d, id: user.id }),
    data: init_data,
    key: "id",
    type: "user"
  })
}
export const updateTheme = props =>
  api.put("user/update/theme", props, { withCredentials: true })
