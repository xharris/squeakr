const { api, checkSchema, ref } = require("../api")

const post_settings = checkSchema({
  visibility: String,
  can_comment: Boolean
})

const post = api("post", {
  schema: {
    content: String,
    type: { type: String, enum: ["video", "image", "text"], default: "text" },
    settings: post_settings,
    user: ref("user"),
    tag: [ref("tag")],
    comment: [ref("comment")]
  }
})

module.exports = {
  post_settings,
  post
}
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

module.exports = {
  post_settings,
  post
}
