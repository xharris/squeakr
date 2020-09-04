import * as api from "."
import { notify } from "util"

const DEBUG = false

// will actually be async in the future
export const get = id =>
  api.get(`card/${id}`).then(res => {
    if (DEBUG) console.log(`card/${id}`, res.data.data)
    return res.data.data
  })
export const getUser = user_id =>
  api.get(`card/user/${user_id}`).then(res => {
    if (DEBUG) console.log(`card/user/${user_id}`, res.data.data)
    return res.data.data
  })
export const update = async (id, props) =>
  api.post(`card/${id}/edit`, props).then(() => notify("card", id))
// props { title, color }
export const add = async props => api.post(`card/add`, props)
export const remove = async id =>
  api
    .post(`card/${id}/remove`)
    // notify all the parent cards of the tragic loss of their child card
    .then(data => data.data.parents.forEach(pid => notify("card", pid._id)))

export const addChild = async (id, child_id) =>
  (typeof child_id === "string"
    ? api.post(`card/${id}/add/${child_id}`)
    : api.post(`card/add`, child_id).then(data => {
        console.log(data)
        return api.post(`card/${id}/add/${data.data.id}`)
      })
  ).then(() => notify("card", id))

export const removeChild = async (id, child_id) =>
  api
    .post(`card/${id}/remove/${child_id}`)
    // notify the parent card of the tragic loss of their child card
    .then(() => notify("card", id))
