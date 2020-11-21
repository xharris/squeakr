const { Api } = require("../api")
const { ref, status } = require("../api/util")

const follow = new Api("follow", {
  source_user: ref("user", { unique: true }),
  type: { type: String, enum: ["tag", "user"] },
  user: ref("user", { unique: true }),
  tag: ref("tag", { unique: true })
})

follow.auth.any = ["/user"]

// follow/user: { user }
follow.router.post("/user", async (req, res) => {
  req.body.source_user = req.user
  req.body.type = "user"
  const doc = await user.model.create(req.body)
  return status(201, res)
})

module.exports = { follow }
