import * as api from "."

export const add = (card_id, props) =>
  api.post(`card/add`, props).then(data => {
    console.log(data)
    return api.post(`card/${card_id}/add/${data.data.id}`)
  })
