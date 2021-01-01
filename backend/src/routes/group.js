const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")

const group = new Api("group", {
  name: { type: String, required: true },
  description: String,
  privacy: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },
  owner: ref("user")
})

group.schema.method("getMemberCount", async function () {
  const [follow] = Api.get("follow")
  const num = await follow.model.countDocuments({
    type: "group",
    group: this._id,
    request: false
  })
  return num + 1
})

group.schema.statics.visibleTo = async function (group, user) {
  if (!user) return false
  const [follow] = Api.get("follow")
  return (
    (await follow.model.exists({
      type: "group",
      source_user: user,
      group,
      request: false
    })) || group.owner === user._id
  )
}

group.auth.any = ["/create", "/update"]

group.router.get("/:name", (req, res) =>
  group.model
    .findOne({ name: req.params.name })
    .exec(async function (err, doc) {
      if (!queryCheck(res, err, doc)) {
        const new_doc = doc.toObject()
        new_doc.members = await doc.getMemberCount()
        return !queryCheck(res, err, doc) && status(201, res, { doc: new_doc })
      }
    })
)

group.router.put("/create", async (req, res) => {
  const doc = await group.model.create({ ...req.body, owner: req.user })
  return status(201, res, { doc })
})

group.router.put("/update/:id", async (req, res) =>
  group.model
    .findOneAndUpdate({ _id: req.params.id, owner: req.user }, req.body)
    .exec(function (err, doc) {
      return !queryCheck(res, err, doc) && status(201, res, { doc })
    })
)

group.router.post("/search", async (req, res) => {
  return !req.body.term || req.body.term.length === 0
    ? status(200, res, { docs: [] })
    : group.model
        .find({ name: new RegExp(req.body.term, "i") })
        .exec((err, docs) =>
          Promise.all(
            docs
              .filter(async doc => {
                // allowed to view?
                return await group.model.visibleTo(doc, req.user)
              })
              .map(async doc => {
                let new_doc = doc.toObject()
                // number of members
                new_doc.members = await doc.getMemberCount()
                return new_doc
              })
          ).then(
            new_docs =>
              !queryCheck(res, err, docs) &&
              status(200, res, { docs: new_docs })
          )
        )
})

module.exports = { group }
