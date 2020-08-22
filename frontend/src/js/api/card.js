import * as api from "."

const DEBUG = true

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
export const update = async (id, props) => api.post(`card/${id}/edit`, props)
// props { title, color }
export const add = async props => api.post(`card/add`, props)
export const remove = async id => api.post(`card/${id}/remove`)
