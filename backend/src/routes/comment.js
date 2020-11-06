import api, { ref } from "../api"

const comment = api("comment", {
  content: String,
  user: ref("user"),
  reaction: [ref("reaction")]
})

export default comment
