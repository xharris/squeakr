const mongoose = require("mongoose")
const securePass = require("secure-password")
const pwd = securePass()

const ref = (name, ...args) => ({
  type: mongoose.Types.ObjectId,
  ref: name,
  ...args
})

const types = mongoose.Schema.Types

const queryCheck = (res, err, doc) => {
  if (err && err.code) {
    switch (err.code) {
      case 11000: // duplicate key
        return status(403, res, { message: `DUPLICATE` })
      default:
        return status(500, res, { message: err.message })
    }
  }
  if (!doc) return status(404, res, { message: err || "NOT FOUND" })
}

const status = (code, res, props) => {
  if (!props) props = {}
  if (!props.message && code >= 200 && code < 300) props.message = "SUCCESS"
  try {
    res.status(code).json({ ...props })
  } catch (e) {
    console.error(`ERROR: path(${res.req.originalUrl})`)
    console.error(e)
  }
}

const secureHash = async str => await pwd.hash(Buffer.from(str))
const verifyHash = async (str, hash) =>
  await pwd.verify(Buffer.from(str), Buffer.from(hash))

const colors = [
  "#ffcdd2",
  "#E1BEE7",
  "#C5CAE9",
  "#B3E5FC",
  "#C8E6C9",
  "#FFF9C4",
  "#FFCC80",
  "#BCAAA4",
  "#CFD8DC"
]

const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

module.exports = {
  ref,
  types,
  queryCheck,
  status,
  secureHash,
  securePass,
  verifyHash,
  randomColor
}
