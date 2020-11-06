import user from "../routes/user"
import { status } from "./util"
const jwt = require("jsonwebtoken")

export const generateJwt = data =>
  jwt.sign({ data }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

export const useAuth = ctrl_fn => {
  return function (req, res, ...args) {
    const deny = res => status(403, res, { message: "BAD_TOKEN" })
    const { token, id } = req.body
    if (!(token && id)) return deny() // no id or token given
    return new Promise((pres, rej) => {
      // decode the jwt
      jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) return deny()
        if (data.data !== id) return deny() // incorrect user
        // verify username and pass
        user.model.findOne({ id: data.data }).exec(async function (err, doc) {
          if (err || !doc) return deny() // user not found
          // success
          return pres(await ctrl_fn(req, res, data.data, ...args))
        })
      })
    })
  }
}
