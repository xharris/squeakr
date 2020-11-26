const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")
const { user } = require("./user")
const { tag } = require("./tag")

const follow = new Api("follow", {
  source_user: ref("user"),
  type: { type: String, enum: ["tag", "user"] },
  user: ref("user"),
  tag: [ref("tag")]
})
follow.schema.index({ source_user: 1, user: 1, tag: 1 }, { unique: true })

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
      .exec(function (err, docs) {
        return err || !docs
          ? status(201, res, { following: false, docs })
          : status(201, res, { following: true, docs })
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
  const tag_docs = await user.model
    .find({
      value: req.params.tags.split(",").map(t => t.trim())
    })
    .lean()
  if (!tag_docs) return status(404, res, { message: "USER_NOT_FOUND" })
  const exists = await follow.model
    .findOne({
      type: "user",
      tag: { $all: tag_docs }
    })
    .lean()
  if (exists) return status(201, res)
  const doc = await follow.model.create({
    source_user: req.user._id,
    type: "tag",
    tag: tag_docs
  })
  return !queryCheck(res, !doc, doc) && status(201, res, { doc })
})

following.router.get("/tags", async (req, res) =>
  tag.model.find({ source_user: req.user }).exec(function (err, docs) {
    return !queryCheck(res, err, docs) && status(201, res, { docs })
  })
)

following.router.get("/tags/:tags", async (req, res) =>
  tag.model
    .find({ source_user: req.user, type: "tag" })
    .exec(function (err, docs) {
      return !queryCheck(res, err, docs) && status(201, res, { docs })
    })
)

unfollow.router.put("/tags/:tags", async (req, res) => {
  const tag_docs = await user.model
    .find({
      value: req.params.tags.split(",").map(t => t.trim())
    })
    .lean()
  follow.model
    .findOneAndDelete({ source_user: req.user, tag: { $all: tag_docs } })
    .exec(function (err, docs) {
      return !queryCheck(res, err, docs) && status(201, res)
    })
})

module.exports = { follow, unfollow }
