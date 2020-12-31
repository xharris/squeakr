const axios = require("axios")

const DEBUG = false

const url = suffix =>
  suffix.startsWith("http")
    ? suffix
    : `http://localhost:${
        process.env.REACT_APP_PORT || process.env.PORT
      }/api/${suffix}`

const transform = (method, suffix, data, config) => {
  if (!config) config = {}
  if (config.cancel) config.cancelToken = new axios.CancelToken(config.cancel)
  return axios({ method, url: url(suffix), data, ...config })
}

export const get = (...args) => transform("get", ...args)
export const post = (...args) => transform("post", ...args)
export const put = (...args) => transform("put", ...args)
export const patch = (...args) => transform("patch", ...args)
export const del = (...args) => transform("delete", ...args)
