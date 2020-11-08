const jwt = require("jsonwebtoken")

export const generateJwt = data =>
  jwt.sign({ data }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

export const verifyJwt = (token, cb) =>
  jwt.verify(token, process.env.JWT_KEY, cb)
