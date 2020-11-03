import * as api from "."
import { notify, useApiUpdate, useFetch } from "util"

export const add = props =>
  api
    .post("category_template/add", props)
    .then(() => notify("category_template"))
export const get = props => api.get("category_template/get", props)
export const update = props => api.post("category_template/update", props)

export const useGet = () => useFetch(get, "category_template")
export const useUpdate = props =>
  useApiUpdate(update, 0, "category_template", props)
