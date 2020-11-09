import api, { ref } from "../api"

const reaction = api("reaction", {
  user: ref("user"),
  vote: { type: Number, enum: [-1, 0, 1], default: 0 },
  icon: String
})

export default reaction
