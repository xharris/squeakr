const axios = require("axios")

const DEBUG = false

const url = suffix => `http://localhost:3000/api/${suffix}`

export const get = (suffix, data) =>
  axios.get(url(suffix), data).then(res => {
    if (DEBUG) console.log(suffix, res.data.data)
    return res.data.data
  })

export const post = (suffix, data) => axios.post(url(suffix), data)
