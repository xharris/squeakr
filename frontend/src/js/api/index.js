const axios = require("axios")

const DEBUG = false

const url = suffix =>
  suffix.startsWith("http") ? suffix : `http://localhost:3000/api/${suffix}`

export const get = (suffix, ...args) =>
  axios.get(url(suffix), ...args).then(res => {
    if (DEBUG) console.log(suffix, res.data)
    return res.data
  })

export const post = (suffix, ...args) => axios.post(url(suffix), ...args)
export const put = (suffix, ...args) => axios.put(url(suffix), ...args)
