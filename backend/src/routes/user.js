const { Api } = require("../api")
const {
  status,
  secureHash,
  verifyHash,
  securePass,
  queryCheck
} = require("../api/util")
const { generateJwt } = require("../api/jwt")
const { post_settings } = require("./post_settings")
const ms = require("ms")
const atob = require("atob")

const user = new Api(
  "user",
  {
    id: { type: String, unique: true, required: true }, // used to identify user for authentication
    email: String,
    username: String,
    display_name: String,
    avatar: String,
    type: { type: Number, enum: ["user", "admin", "api"] },
    theme: {
      primary: { type: String, default: "#E0E0E0" },
      secondary: { type: String, default: "#FFFFFF" },
      font: { type: String },
      header_char: { type: String, default: "\\" }
    },
    default_post_settings: post_settings,
    pwd: {
      type: String,
      get: () => undefined
    }
  },
  {
    schema: { toJSON: { getters: true }, toObject: { getters: false } }
  }
)

user.schema.static("usernameToDocId", async function (username) {
  const doc = await this.findOne({ username })
  if (doc) {
    return doc._id
  }
})

user.auth.any = ["/verify", "/update/theme"]

user.router.post("/add", async (req, res) => {
  req.body.pwd = await secureHash(req.body.pwd)
  const doc = await user.model.create(req.body)
  status(201, res, {
    _id: doc._id
  })
})
user.router.post("/get", (req, res) =>
  user.model
    .find()
    .where(req.body.key || "_id")
    .in(req.body.values)
    .exec(
      (err, docs) =>
        !queryCheck(res, err, docs.length > 0) &&
        status(200, res, {
          users: docs.map(d => d.toJSON())
        })
    )
)
user.router.post("/verify", async (req, res) => {
  const doc = await user.model.findOne({ id: req.user.id })
  if (queryCheck(res, "USER_NOT_FOUND", doc))
    return status(401, res, { message: "NOT_AUTHORIZED" })
  return status(200, res, { data: doc })
})
user.router.post("/logout", async (req, res) => {
  res.cookie("auth", "0", { maxAge: new Date(), signed: true, httpOnly: true })
  return status(200, res)
})
user.router.post("/login", async (req, res) => {
  const [id, pwd] = atob(req.get("authorization").split(" ")[1]).split(":")
  const doc = await user.model.findOne({ id }).exec()

  const deny = () => status(403, res, { message: "BAD_LOGIN" })
  const accept = async () => {
    res.cookie(
      "auth",
      generateJwt(doc.id, {
        expiresIn: ms("90 days")
      }),
      {
        maxAge: req.body.remember && ms("90 days"),
        httpOnly: true,
        signed: true
      }
    )
    const user_doc = await user.model.findOne({ id: doc.id })
    if (queryCheck(res, "USER_NOT_FOUND", user_doc))
      return status(401, res, { message: "NOT_AUTHORIZED" })
    return status(200, res, { data: user_doc })
  }

  if (!pwd || !doc) return deny()
  const doc_obj = doc.toObject()
  const result = await verifyHash(pwd, doc_obj.pwd)

  switch (result) {
    case securePass.VALID:
      return accept()

    case securePass.VALID_NEEDS_REHASH:
      doc.pwd = await secureHash(doc.pwd)
      await doc.save()
      return accept()

    default:
      return deny()
  }
})
user.router.put("/update/theme", (req, res) =>
  req.user.id === req.body.id
    ? user.model.updateOne(
        { id: req.user.id },
        {
          $set: {
            "theme.primary": req.body.primary,
            "theme.secondary": req.body.secondary
          }
        },
        { runValidators: true, omitUndefined: true },
        (err, doc) => {
          if (!queryCheck(res, err, doc)) status(201, res)
        }
      )
    : status(403, res, { message: "DIFF_USER" })
)

module.exports = { user }
