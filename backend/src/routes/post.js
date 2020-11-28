const { Api } = require("../api")
const { ref, status, queryCheck, types } = require("../api/util")
const { tag } = require("./tag")
const { user } = require("./user")
const { follow } = require("./follow")
const { post_settings } = require("./post_settings")

const post = new Api(
  "post",
  {
    content: { type: String, default: "", required: true },
    settings: post_settings,
    user: ref("user"),
    tags: [ref("tag")],
    comments: [ref("comment")],
    reaction: [ref("reaction", { unique: true })]
  },
  {
    schema: { toJSON: { getters: true }, toObject: { getters: true } }
  }
)

post.auth.any = ["/add", "/feed"]

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
  const tags = []
  for (var value of req.body.tags) {
    const doc = await tag.model.findOne({ value })
    tags.push(doc || (await tag.model.create({ value, request: true })))
  }

  console.log(tags)

  const doc = await post.model.create({
    ...req.body,
    tags,
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

post.router.post("/tag", async (req, res) => {
  const tag_ids = await tag.model
    .find({
      value: { $in: req.body.tags },
      request: false
    })
    .select("_id")
    .exec()

  return post.model
    .find({ tags: { $all: tag_ids } })
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
})

post.router.get("/:id", async (req, res) =>
  post.model
    .findById(req.params.id)
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec((err, doc) => !queryCheck(res, err, doc) && status(200, res, { doc }))
)

post.router.post("/preview", (req, res) =>
  status(200, res, {
    ...req.body,
    user: {
      username: "jdoe",
      display_name: "John Doe",
      email: "jdoe@email.com"
    }
  })
)

post.router.post("/feed", async (req, res) => {
  const follows = await follow.model.find({ source_user: req.user }).lean()
  const user_ids = follows.filter(f => f.type === "user").map(f => f.user)
  const tag_combos = follows
    .filter(f => t.type === "tag")
    .map(f => ({ tag: { $all: f.tag } }))
  console.log({ $or: [{ user: user_ids }, ...tag_combos] })
  const posts = await post.model
    .find({ $or: [{ user: user_ids }, ...tag_combos] })
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec()
  return (
    !queryCheck(res, "NOT_FOUND", posts) && status(200, res, { docs: posts })
  )
})

// post.rouer.put("update", useAuth((req, res, user) => ))

module.exports = { post, post_settings }
