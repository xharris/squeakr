const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")
const { tag } = require("./tag")
const { user } = require("./user")
const { post_settings } = require("./post_settings")

const post = new Api("post", {
  content: { type: String, set: setContent },
  type: { type: String, enum: ["video", "image", "text"], default: "text" },
  settings: post_settings,
  user: ref("user"),
  tags: [ref("tag")],
  comments: [ref("comment")],
  reaction: [ref("reaction", { unique: true })]
})

const re_video = [/youtu(?:\.be\/(.+)|be\.com.+(?:v=|embed\/)(.+)\?+?)/i]

function setContent(content) {
  var video_id
  for (const re of re_video) {
    const match = content.match(re)
    if (match) video_id = match[0]
  }

  if (video_id) this.type = "video"

  return content
}

post.auth.push("/add")

post.router.post((req, res) =>
  post.model
    .find({ user: req.body.id })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
)

post.router.put((req, res) =>
  post.model
    .findByIdAndUpdate(req.body._id, req.body)
    .exec((err, doc) => !queryCheck(res, err, doc) && status(200, res, { doc }))
)

post.router.post("/add", async (req, res) => {
  const doc = await post.model.create({
    ...req.body,
    tags: await tag.model.find({ value: { $in: req.body.tags } }),
    user: req.user._id
  })
  status(201, res, {
    _id: doc._id
  })
})

post.router.get("/user/:id", async (req, res) =>
  post.model
    .find({ user: await user.model.usernameToDocId(req.params.id) })
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
)

post.router.get("/:id", async (req, res) =>
  post.model
    .findById(req.params.id)
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
)

// post.rouer.put("update", useAuth((req, res, user) => ))

module.exports = { post, post_settings }
