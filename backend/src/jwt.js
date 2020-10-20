import { model as userModel } from "./api/user"
import { status } from "./util"
const jwt = require("jsonwebtoken")

export const generateJwt = data =>
  jwt.sign({ data }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

export const useJwt = ctrl_fn => {
  const deny = (res, message) => status(403, res, { message })
  return function (req, res, ...args) {
    const { token, id } = req.body
    if (!(token && id)) return deny(res, "Provide id and token")
    return new Promise((pres, rej) => {
      // decode the jwt
      jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) return deny(res, err.name)
        if (data.data !== id) return deny(res, "Incorrect user")
        // verify username and pass
        return userModel
          .findOne({ _id: data.data })
          .exec(async function (err, doc) {
            if (err || !doc) return deny(res, "User not found")
            // success
            return pres(await ctrl_fn(req, res, ...args))
          })
      })
    })
  }
}
