const { Api } = require("../api")
const { ref, status, queryCheck, types } = require("../api/util")
const { tag } = require("./tag")
const { group } = require("./group")
const { user } = require("./user")
const { follow } = require("./follow")
const { post_settings } = require("./post_settings")

const post = new Api(
  "post",
  {
    content: { type: String, default: "", required: true },
    settings: post_settings,
    user: ref("user"),
    group: [ref("group")],
    comments: { type: [ref("comment")], default: [] },
    reaction: { type: [ref("reaction")], default: [], unique: true }
  },
  {
    schema: { toJSON: { getters: true }, toObject: { getters: true } }
  }
)

post.auth.any = ["/add", "/update", "/feed"]

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
    .populate({ path: "group", model: tag.model })
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
  const groups = req.body.groups
    ? (await group.model.find({ name: req.body.groups }, "_id").lean()).map(
        t => t._id
      )
    : []
  const following =
    req.body.following && req.user
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
  if (groups.length > 0) query.groups = groups
  console.log("query", query)
  let posts = await post.model
    .find(query)
    .populate({ path: "user", model: user.model })
    .populate({ path: "groups", model: group.model })
    .exec()

  if (req.body.size === "small") {
    posts = posts.map(p => {
      p = p.toObject()
      p.content = p.content.slice(0, 300)
      return p
    })
  }

  return (
    !queryCheck(res, "NO_POSTS", posts) && status(200, res, { docs: posts })
  )
})

module.exports = { post, post_settings }
