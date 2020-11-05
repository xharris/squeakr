import api, { schema } from "../api"
import user from "./user"

const reaction = api("reaction", {
  user: user.ref,
  vote: { type: Number, enum: [-1, 0, 1], default: 0 },
  icon: String
})

export default reaction
