const { Api } = require("../api")
const {
  status,
  secureHash,
  verifyHash,
  securePass,
  queryCheck
} = require("../api/util")
const { generateJwt } = require("../api/jwt")
const { post_settings } = require("./post")

const user = new Api(
  "user",
  {
    id: { type: String, unique: true, required: true }, // used to identify user for authentication
    email: String,
    username: String,
    display_name: String,
    avatar: String,
    theme: {
      primary: { type: String, default: "#E0E0E0" },
      secondary: { type: String, default: "#FFFFFF" },
      font: { type: String }
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

user.auth.push("/verify", "/update/theme")

user.router.post("/add", async (req, res) => {
  req.body.pwd = await secureHash(req.body.pwd)
  const doc = await user.model.create(req.body)
  status(201, res, {
    _id: doc._id
  })
})
user.router.post("/get", async (req, res) => {
  const docs = await user.model
    .find()
    .where(req.body.key || "_id")
    .in(req.body.values)
    .exec()
  return status(201, res, {
    users: docs.map(d => d.toJSON())
  })
})
user.router.post("/verify", async (req, res) => {
  const doc = await user.model.findOne({ id: req.user.id })
  if (queryCheck(res, "USER_NOT_FOUND", doc))
    return status(401, res, { message: "NOT_AUTHORIZED" })
  return status(200, res, { data: doc })
})
user.router.post("/login", async (req, res) => {
  const doc = await user.model.findOne({ id: req.body.id }).exec()

  const deny = () => status(403, res, { message: "BAD_LOGIN" })
  const accept = () =>
    status(200, res, {
      token: generateJwt(doc.id)
    })

  if (!req.body.pwd) return deny()
  const doc_obj = doc.toObject()
  const result = await verifyHash(req.body.pwd, doc_obj.pwd)

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
user.router.post("/update/theme", (req, res) => {})

/*

user.router.add(async req => ({
  ...req.body,
  theme: {
    ...req.body.theme,
    secondary: req.body.theme.secondary || randomColor()
  },
  pwd: await secureHash(req.body.pwd)
}))

user.router.post("get", async (req, res) => {
  const docs = await user.query.getByIdList(req.body.values, req.body.key)

  return status(201, res, {
    users: docs.map(doc => ({ ...doc.toJSON() }))
  })
})

// { id, pwd } returns jwt
user.router.post(
  "login",
  async (req, res) =>
    await get({
      req,
      res,
      model: user.model,
      query: {
        id: req.body.id
      },
      cb: async function (err, doc) {
        if (!queryCheck(res, "USER_NOT_FOUND", doc)) {
          const deny = () => status(403, res, { message: "BAD_LOGIN" })
          const accept = () =>
            status(200, res, {
              token: generateJwt(doc.id)
            })

          if (!req.body.pwd) return deny()
          const doc_obj = doc.toObject()
          const result = await verifyHash(req.body.pwd, doc_obj.pwd)

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
        }
      }
    })
)

user.router.post(
  "verify",
  useAuth((req, res, user_id) =>
    get({
      req,
      res,
      model: user.model,
      query: {
        id: user_id
      },
      cb: function (err, doc) {
        if (queryCheck(res, err, doc))
          return status(401, res, { message: "NOT_AUTHORIZED" })
        return status(200, res, { data: doc })
      }
    })
  )
)

user.router.put(
  "update/theme",
  useAuth((req, res, user_id) =>
    user_id === req.body.id
      ? updateOne({
          req,
          res,
          model: user.model,
          query: { id: user_id },
          bodyMod: body => ({
            $set: {
              "theme.primary": body.primary,
              "theme.secondary": body.secondary
            }
          })
        })
      : status(403, res, { message: "DIFF_USER" })
  )
)
*/

module.exports = { user }
