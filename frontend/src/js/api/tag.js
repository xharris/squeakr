import * as api from "."
import { useFetch } from "util"

export const useSearch = () =>
  useFetch(term => api.post("tag/search", { term }).then(res => res.data.docs))
export const isValid = values =>
  api.post("tag/verify", { values: [].concat(values) }).then(res => res.data)
