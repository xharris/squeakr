const { Api } = require("../api")
const { ref, status, queryCheck, types } = require("../api/util")
const { tag } = require("./tag")
const { user } = require("./user")
const { post_settings } = require("./post_settings")

const post = new Api(
  "post",
  {
    content: { type: String, set: setContent, default: "", required: true },
    type: { type: String, enum: ["youtube", "image", "text"], default: "text" },
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

const re_video = [/youtu(?:\.be\/(.+)|be\.com.+(?:v=(.+)|embed\/(.+)\?))/i]

function getContentInfo(doc) {
  if (Array.isArray(doc)) {
    return doc.map(d => getContentInfo(d))
  }
  doc = {
    content: "",
    _id: types.ObjectId(),
    ...(doc && doc.toJSON ? doc.toJSON() : doc)
  }
  const { content } = doc
  var video_id
  for (const re of re_video) {
    const match = content.match(re)
    if (match) video_id = match[1] || match[2] || match[3]
  }
  if (video_id) {
    doc.type = "youtube"
    doc.video_id = video_id
  } else {
    doc.type = "text"
  }
  if (!doc.date_created) {
    doc.date_created = Date.now()
  }
  return doc
}

function setContent(content) {
  this.type = getContentInfo({ content }).type
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
      (err, docs) =>
        !queryCheck(res, err, docs) &&
        status(200, res, { docs: getContentInfo(docs) })
    )
)

post.router.post("/tag", async (req, res) => {
  const tag_ids = await tag.model
    .find({
      value: { $regex: new RegExp(`^${req.body.tags.join("|")}$`, "i") }
    })
    .select("_id")
    .exec()

  return post.model
    .find({ tags: { $in: tag_ids } })
    .populate({ path: "user", model: user.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
})

post.router.get("/:id", async (req, res) =>
  post.model
    .findById(req.params.id)
    .populate({ path: "user", model: user.model })
    .populate({ path: "tags", model: tag.model })
    .exec(
      (err, doc) =>
        !queryCheck(res, err, doc) &&
        status(200, res, { doc: getContentInfo(doc) })
    )
)

post.router.post("/preview", (req, res) =>
  status(200, res, {
    ...getContentInfo(req.body),
    user: {
      username: "jdoe",
      display_name: "John Doe",
      email: "jdoe@email.com"
    }
  })
)

// post.rouer.put("update", useAuth((req, res, user) => ))

module.exports = { post, post_settings }
