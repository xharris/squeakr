import api, { schema, types } from "."
import tag from "./tag"

const field_template = schema({
  name: String,
  type: { type: String, enum: ["bool", "str", "num", "event"] }
})

export const category_template = api("category_template", {
  name: { type: String, default: "" },
  fields: { type: [field_template], default: [] },
  unique: Boolean,
  color: "color",
  searchable: { type: Boolean, default: true }
})

const field = schema({
  _id: { type: types.ObjectId }, // field_template
  value: types.Mixed
})

const category = api("category", {
  template: { type: types.ObjectId, ref: category_template.name },
  fields: { type: [field], default: [] },
  tags: { type: types.ObjectId, ref: tag.name }
})

category_template.router.add()
category_template.router.getBy()
category_template.router.update()

export default category
