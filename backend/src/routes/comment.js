const { Api } = require("../api")
const { ref, queryCheck, status } = require("../api/util")

const comment = new Api("comment", {
  content: String,
  user: ref("user"),
  reaction: [ref("reaction", { unique: true })],
  comment: [ref("comment")]
})

module.exports = { comment }

comment.auth.any = ["/add", "/update"]

comment.router.post("/add", async (req, res) => {
  const body = {
    content: req.body.content,
    user: req.user
  }
  let parent_doc
  if (req.body.post) {
    const [post] = Api.get("post")
    parent_doc = await post.model.findById(req.body.post).exec()
  } else if (req.body.comment) {
    parent_doc = await comment.model.findById(req.body.comment).exec()
  }
  const doc = await comment.model.create(body)
  if (doc) {
    parent_doc.comment.push(doc)
    parent_doc.save()
  }
  if (!queryCheck(res, "ERROR", doc)) {
    status(200, res, { doc })
    comment.emit(`add-${req.body.post ? "post" : "comment"}`, parent_doc._id)
  }
})

comment.router.patch("/update", (req, res) =>
  comment.model
    .findOneAndUpdate({ _id: req.body.id, user: req.user }, req.body)
    .exec((err, doc) => {
      if (!queryCheck(res, err, doc)) {
        status(200, res, { doc })
        comment.emit("update", doc._id)
      }
    })
)

comment.router.get("/:id", (req, res) =>
  comment.model
    .findById(req.params.id)
    .populate("user")
    .exec((err, doc) => !queryCheck(res, err, doc) && status(200, res, { doc }))
)
