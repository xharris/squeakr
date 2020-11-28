const { Api } = require("../api")
const { status, queryCheck } = require("../api/util")

const tag = new Api("tag", {
  value: { type: String, trim: true, unique: true },
  request: { type: Boolean, default: false }
})
tag.schema.index({ value: "text" })

tag.auth.any = ["/request"]
tag.auth.admin = ["/approve"]

tag.schema.statics.findByString = function (str, cb) {
  return tag.model
    .find(
      {
        value: { $in: str.split(",").map(t => t.trim()) }
      },
      cb
    )
    .lean()
}

tag.router.put("/request/:value", async (req, res) => {
  await tag.model.create({ value: req.params.value, request: true })
  return status(201, res)
})

tag.router.put("/approve", async (req, res) => {
  await tag.model.update({ _id: req.body.id }, { request: false })

  return status(201, res, {
    _id: await tag.model.create(req.body)._id
  })
})

tag.router.post("/search", (req, res) =>
  !req.body.term || req.body.term.length === 0
    ? status(200, res, { docs: [] })
    : tag.model
        .find({ value: new RegExp(req.body.term, "i"), request: false })
        .exec(
          (err, docs) =>
            !queryCheck(res, err, docs) && status(200, res, { docs })
        )
)

tag.router.post("/verify", (req, res) =>
  tag.model.find({ value: { $in: req.body.values } }).exec((err, docs) => {
    if (!queryCheck(res, err, docs)) {
      if (docs.length === req.body.values) status(201, res)
      else {
        const valid_values = docs.map(d => d.value)
        status(200, res, {
          invalid: req.body.values.filter(v => !valid_values.includes(v)),
          message:
            valid_values.length === req.body.values.length
              ? "SUCCESS"
              : "INVALID"
        })
      }
    }
  })
)

module.exports = { tag }
