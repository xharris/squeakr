const axios = require("axios")

const DEBUG = false

const url = suffix =>
  suffix.startsWith("http") ? suffix : `http://localhost:3000/api/${suffix}`

export const get = (suffix, data) =>
  axios.get(url(suffix), data).then(res => {
    if (DEBUG) console.log(suffix, res.data)
    return res.data
  })

export const post = (suffix, data) => axios.post(url(suffix), data)
export const put = (suffix, data) => axios.put(url(suffix), data)
