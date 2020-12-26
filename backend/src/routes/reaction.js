const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")

const reaction = new Api("reaction", {
  user: ref("user", { required: true }),
  post: ref("post"),
  comment: ref("comment"),
  icon: String
})
reaction.schema.index(
  { user: 1, post: 1, comment: 1, icon: 1 },
  { unique: true }
)

reaction.router.put(["/post", "/comment"], async (req, res) => {
  const query = { ...req.body, user: req.user }
  const type = req.body.comment ? "comment" : "post"
  reaction.model.findOneAndDelete(query).exec(async (err, doc) => {
    if (err || !doc) {
      // create the reaction
      const doc = await reaction.model.create(query)
      reaction.emit(`${type}-add`, req.body[type])
      status(201, res, { doc })
    } else {
      // reaction removed
      reaction.emit(`${type}-delete`, req.body[type])
      status(201, res)
    }
  })
})

reaction.router.get(
  ["/post/:postid", "/comment/:commentid"],
  async (req, res) =>
    reaction.model
      .find(
        req.params.postid
          ? { post: req.params.postid }
          : { comment: req.params.commentid }
      )
      .exec(
        (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
      )
)

module.exports = { reaction }
