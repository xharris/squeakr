const { Api } = require("../api")
const { ref } = require("../api/util")

const post_settings = {
  visibility: String,
  can_comment: Boolean
}

const post = new Api("post", {
  content: String,
  type: { type: String, enum: ["video", "image", "text"], default: "text" },
  settings: post_settings,
  user: ref("user"),
  tag: [ref("tag")],
  comment: [ref("comment")]
})

module.exports = { post, post_settings }
