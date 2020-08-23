import * as api from "."

export const add = (card_id, props) =>
  api.post(`card/add`, props).then(data => {
    console.log(data)
    return api.post(`card/${card_id}/add/${data.data.id}`)
  })
export const remove = async id => api.post(`card/${id}/remove`)
export const update = async (id, props) => api.post(`card/${id}/edit`, props)
