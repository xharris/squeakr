const { Api } = require("../api")
const { ref, status, queryCheck } = require("../api/util")

const group = new Api("group", {
  name: { type: String, required: true },
  description: String,
  owner: ref("user")
})
group.schema.index({ name: 1, owner: 1 }, { unique: true })

group.auth.any = ["/create", "/update"]

group.router.get("/:name", (req, res) =>
  group.model.findOne({ name: req.params.name }).exec(function (err, doc) {
    return !queryCheck(res, err, doc) && status(201, res, { doc })
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

group.router.post("/search", (req, res) =>
  !req.body.term || req.body.term.length === 0
    ? status(200, res, { docs: [] })
    : group.model
        .find({ value: new RegExp(req.body.term, "i"), request: false })
        .exec(
          (err, docs) =>
            !queryCheck(res, err, docs) && status(200, res, { docs })
        )
)

module.exports = { group }
