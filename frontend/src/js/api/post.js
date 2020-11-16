import * as api from "."
import { useUpdate as utilUseUpdate } from "util"
import { useAuthContext } from "component/auth"

export const useAdd = () => {
  const { user } = useAuthContext()
  return props => api.post("post/add", { ...props, token: user && user.token })
}

export const useUpdate = init_data => {
  const { user } = useAuthContext()
  return utilUseUpdate({
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
export const getUser = id => api.get(`post/user/${id}`)
export const get = id => api.get(`post/${id}`, { id }).then(res => res.docs)
