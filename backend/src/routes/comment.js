import api from "../api"
import user from "./user"
import reaction from "./reaction"

const comment = api("comment", {
  content: String,
  user: user.ref,
  reaction: [reaction.ref]
})

export default comment
