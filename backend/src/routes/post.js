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
    reaction: [ref("reaction", { unique: true })],
    spoiler: Boolean
  },
  {
    schema: { toJSON: { getters: true }, toObject: { getters: true } }
  }
)

post.auth.any = ["/add", "/update", "/feed", "/query"]

post.router.post("/add", async (req, res) => {
  const tags = []
  for (var value of req.body.tags) {
    const doc = await tag.model.findOne({ value })
    tags.push(doc || (await tag.model.create({ value, request: true })))
  }

  const doc = await post.model.create({
    ...req.body,
    tags,
    user: req.user._id
  })
  status(201, res, {
    _id: doc._id
  })
})

post.router.put("/update", async (req, res) => {
  const tags = []
  for (var value of req.body.tags) {
    const doc = await tag.model.findOne({ value })
    tags.push(doc || (await tag.model.create({ value, request: true })))
  }

  post.model
    .findByIdAndUpdate(req.body._id, { ...req.body, tags })
    .exec((err, doc) => !queryCheck(res, err, doc) && status(200, res, { doc }))
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

post.router.post("/feed", async (req, res) => {
  const follows = await follow.model.find({ source_user: req.user }).lean()
  const user_ids = follows.filter(f => f.type === "user").map(f => f.user)
  const tag_combos = follows
    .filter(t => t.type === "tag")
    .map(f => ({ tag: { $all: f.tag } }))
  const posts = await post.model
    .find({ $or: [{ user: user_ids }, ...tag_combos] })
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec()
  return (
    !queryCheck(res, "NOT_FOUND", posts) && status(200, res, { docs: posts })
  )
})

/* query
{
  usernames: [],
  user_ids: [],
  tags: [], // empty for all tags
  sort: '', // newest, oldest, controversial, popular
  following: t/f
}
*/
post.router.post("/query", async (req, res) => {
  const users = req.body.usernames
    ? (
        await user.model.find({ username: req.body.usernames }, "_id").lean()
      ).map(u => u._id)
    : req.body.user_ids || []
  const tags = req.body.tags
    ? (await tag.model.find({ value: req.body.tags }, "_id").lean()).map(
        t => t._id
      )
    : []
  const following = req.body.following
    ? (
        await follow.model
          .find({ source_user: req.user._id, type: "user" }, "user")
          .lean()
      ).map(u => u.user)
    : []

  const query = {}
  if (users.length > 0 || req.body.following) {
    query.user = users.concat(following)
  }
  if (tags.length > 0) {
    if (req.body.tag_exact) query.tags = { $all: tags }
    else query.tags = { $exists: true, $in: tags }
  }
  // console.log(query, following)
  let posts = await post.model
    .find(query)
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec()

  if (req.body.size === "small") {
    posts = posts.map(p => {
      p = p.toObject()
      p.content = p.content.slice(0, 300)
      console.log(p.content)
      return p
    })
  }

  return (
    !queryCheck(res, "NO_POSTS", posts) && status(200, res, { docs: posts })
  )
})

module.exports = { post, post_settings }
