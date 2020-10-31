import api, { types } from "."
import category from "./category"

const comment = api("comment", {
  action: String,
  result: String,
  priority: { type: String, enum: ["low", "med", "high"] },
  patient_visible: { type: Boolean, default: true },
  category: { type: types.ObjectId, ref: category.name }
})
