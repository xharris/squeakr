import api, { types } from "."

const category_template = api("category_template", {
  name: String,
  fields: { type: Map, of: types.Mixed },
  unique: Boolean,
  color: "color",
  searchable: { type: Boolean, default: true }
})

export default category_template
