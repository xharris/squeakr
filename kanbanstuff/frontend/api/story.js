import * as api from "."
import { notify, useApiUpdate } from "util"

export const get = id => api.get(`story/${id}`)
export const update = async (_id, data) =>
  api
    .post("story/update", { _id, ...data })
    .then(res => console.log(res) && notify("story", _id))
export const useUpdate = initial_data =>
  useApiUpdate(
    payload => update(initial_data._id, payload),
    0, //2000,
    initial_data
  )

export const add = props => api.post("story/add", props)
