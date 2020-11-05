import api from "../api"
import user from "./user"
import tag from "./tag"
import comment from "./comment"

export const post_settings = schema({
  visibility: String,
  can_comment: Boolean
})

const post = api("post", {
  content: String,
  type: { type: String, enum: ["video", "image", "text"], default: "text" },
  settings: post_settings,
  user: user.ref,
  tag: [tag.ref],
  comment: [comment.ref]
})

export default post
