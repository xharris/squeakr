const axios = require("axios")

const url = suffix => `http://localhost:3000/api/${suffix}`

export const get = suffix => axios.get(url(suffix))
export const post = (suffix, data) => axios.post(url(suffix), data)
