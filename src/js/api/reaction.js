import * as api from "."

export const post = (post, icon) =>
  icon
    ? api.put("reaction/post", { post, icon }, { withCredentials: true })
    : api.get(`reaction/post/${post}`)

export const comment = (comment, icon) =>
  icon
    ? api.put("reaction/comment", { comment, icon }, { withCredentials: true })
    : api.get(`reaction/comment/${comment}`)
