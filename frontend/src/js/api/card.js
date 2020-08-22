import * as api from "."

// will actually be async in the future
export const get = id =>
  api.get(`card/${id}`).then(res => {
    console.log(`card/${id}`, res.data.data)
    return res.data.data
  })
export const getUser = user_id =>
  api.get(`card/user/${user_id}`).then(res => {
    console.log(`card/user/${user_id}`, res.data.data)
    return res.data.data
  })
export const update = async (id, props) => api.post(`card/${id}/edit`, props)
// props { title, color }
export const add = async props => api.post(`card/add`, props)
export const remove = async id => api.post(`card/${id}/remove`)
