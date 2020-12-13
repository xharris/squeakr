const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")
const { user } = require("./user")
const { tag } = require("./tag")

const follow = new Api("follow", {
  source_user: ref("user"),
  type: { type: String, enum: ["tag", "user"] },
  user: ref("user"),
  tags: [ref("tag")],
  tag_order: [String]
})
follow.schema.index({ source_user: 1, user: 1, tag_order: 1 }, { unique: true })

const unfollow = new Api("unfollow")
const following = new Api("following")

follow.auth.any = ["/user/"]
unfollow.auth = follow.auth
following.auth = follow.auth

// USER

follow.router.put("/user/:username", async (req, res) => {
  const user_doc = await user.model
    .findOne({ username: req.params.username })
    .lean()
  if (!user_doc) return status(404, res, { message: "USER_NOT_FOUND" })
  const exists = await follow.model
    .findOne({ type: "user", user: user_doc })
    .lean()
  if (exists) return status(201, res)
  const doc = await follow.model.create({
    source_user: req.user._id,
    type: "user",
    user: user_doc
  })
  return !queryCheck(res, !doc, doc) && status(201, res, { doc })
})

unfollow.router.put("/user/:username", async (req, res) => {
  const user_doc = await user.model
    .findOne({ username: req.params.username })
    .lean()
  return (
    !queryCheck(res, "USER_NOT_FOUND", user_doc) &&
    follow.model
      .findOneAndDelete({ source_user: req.user, user: user_doc })
      .exec(function (err, docs) {
        return !queryCheck(res, err, docs) && status(201, res)
      })
  )
})

following.router.post("/user/:username", async (req, res) => {
  const user_doc = await user.model
    .findOne({ username: req.params.username })
    .lean()
  return (
    queryCheck(res, "USER_NOT_FOUND", user_doc) ||
    follow.model
      .findOne({ source_user: req.user, user: user_doc })
      .exec(function (err, doc) {
        return err || !doc
          ? status(201, res, { following: false, doc })
          : status(201, res, { following: true, doc })
      })
  )
})

// get users followed by :username
following.router.post(["/users", "/users/:username"], async (req, res) =>
  follow.model
    .find({ source_user: req.user, type: "user" })
    .exec((err, docs) => !queryCheck(res, err, docs) && status(201, res))
)

// TAGS

follow.router.put("/tags/:tags", async (req, res) => {
  const tag_docs = await tag.model.findByString(req.params.tags)
  if (!tag_docs) return status(404, res, { message: "TAG_NOT_FOUND" })
  const exists = await follow.model
    .findOne({
      type: "user",
      tags: { $all: tag_docs }
    })
    .lean()
  if (exists) return status(403, res)
  const doc = await follow.model.create({
    source_user: req.user,
    type: "tag",
    tags: tag_docs,
    tag_order: req.params.tags.split(",")
  })
  return status(201, res, { following: true, doc })
})

following.router.post("/tags", async (req, res) =>
  follow.model
    .find({ source_user: req.user })
    .populate("tags")
    .exec(function (err, docs) {
      return !queryCheck(res, err, docs) && status(201, res, { docs })
    })
)

following.router.post("/tags/:tags", async (req, res) => {
  const tag_docs = await tag.model.findByString(req.params.tags)
  if (!tag_docs) return status(404, res, { message: "TAG_NOT_FOUND" })
  follow.model
    .findOne({
      source_user: req.user,
      type: "tag",
      tags: { $all: tag_docs }
    })
    .populate("tags")
    .exec(function (err, doc) {
      return status(201, res, { following: !err && doc ? true : false, doc })
    })
})

unfollow.router.put("/tags/:tags", async (req, res) => {
  const tag_docs = await tag.model.findByString(req.params.tags)
  follow.model
    .findOneAndDelete({ source_user: req.user, tags: { $all: tag_docs } })
    .exec(function (err, doc) {
      return status(201, res, { following: false })
    })
})

module.exports = { follow, unfollow }
