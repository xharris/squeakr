const { Api } = require("../api")
const { status, queryCheck } = require("../api/util")

const tag = new Api("tag", {
  value: String
})
tag.schema.index({ value: "text" })

tag.router.post("/add", async (req, res) =>
  status(201, res, {
    _id: await tag.model.create(req.body)._id
  })
)

tag.router.post("/search", (req, res) =>
  !req.body.term || req.body.term.length === 0
    ? status(200, res, { docs: [] })
    : tag.model
        .find({ value: new RegExp(req.body.term, "i") })
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
