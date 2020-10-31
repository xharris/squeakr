import api, { schema } from "."
import category from "./category"

const patient = api("patient", {
  _id: "shortid",
  name: String,
  picture: String,
  categories: [category.schema]
})
