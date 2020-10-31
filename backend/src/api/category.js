import api, { types } from "."
import category_template from "./category_template"
import tag from "./tag"

const category = api("category", {
  template: { type: types.ObjectId, ref: category_template.name },
  fields: { type: Map, of: types.Mixed },
  tags: { type: types.ObjectId, ref: tag.name }
})

export default category
