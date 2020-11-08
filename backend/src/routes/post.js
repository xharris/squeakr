import api, { checkSchema, ref } from "../api"

export const post_settings = checkSchema({
  visibility: String,
  can_comment: Boolean
})

const post = api("post", {
  content: String,
  type: { type: String, enum: ["video", "image", "text"], default: "text" },
  settings: post_settings,
  user: ref("user"),
  tag: [ref("tag")],
  comment: [ref("comment")]
})

export default post
