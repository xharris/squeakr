import * as api from "."
import { useUpdate } from "util"
import { useAuthContext } from "component/auth"

export const add = props => api.post("user/add", props)
export const useUpdate = init_data => {
  const { user } = useAuthContext()
  return useUpdate({
    fn: d =>
      api.put("post/update", {
        ...d,
        token: user && user.token
      }),
    data: init_data,
    type: "post"
  })
}

export const getTag = tags => api.get("post/tag", { tags: [].concat(tags) })
export const getUser = id => api.get("post/user", { id })
