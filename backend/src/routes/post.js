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

/*
post.router.post(
  "add",
  useAuth((req, res, user) => {
    add({
      req,
      res,
      model: post.model,
      body: () => {
        req.body.user = user
      }
    })
  })
)*/

// post.rouer.put("update", useAuth((req, res, user) => ))

module.exports = { post, post_settings }
