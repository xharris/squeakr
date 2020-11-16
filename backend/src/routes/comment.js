const { Api } = require("../api")
const { ref } = require("../api/util")

const comment = new Api("comment", {
  content: String,
  user: ref("user"),
  reaction: [ref("reaction", { unique: true })]
})

module.exports = { comment }
