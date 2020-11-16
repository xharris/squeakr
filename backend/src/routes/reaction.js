const { Api } = require("../api")
const { ref } = require("../api/util")

const reaction = new Api("reaction", {
  user: ref("user", { unique: true }),
  vote: { type: Number, enum: [-1, 0, 1], default: 0 },
  icon: String
})

module.exports = { reaction }
