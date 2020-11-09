import * as api from "."
import { useUpdate } from "util"
import { useAuthContext } from "component/auth"

export const add = props => api.post("user/add", props)
export const get = values =>
  api.post("user/get", { values: [].concat(values), key: "username" })
export const login = props => api.post("user/login", props)
export const verifyToken = token => api.post("user/verify", { token })

export const useTheme = init_data => {
  const { user } = useAuthContext()
  return useUpdate({
    fn: d =>
      api.put("user/update/theme", {
        ...d,
        id: user.id,
        token: user && user.token
      }),
    data: init_data,
    key: "id",
    type: "user"
  })
}
export const updateTheme = props => api.put("user/update/theme", props)
