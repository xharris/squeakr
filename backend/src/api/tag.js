import api from "."

const tag = api("tag", {
  value: { type: String, unique: true },
  color: "color"
})

export default tag
