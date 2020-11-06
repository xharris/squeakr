import api, { schema } from "../api"
import {
  securePass,
  secureHash,
  verifyHash,
  status,
  randomColor
} from "../api/util"
import { generateJwt, useAuth } from "../api/jwt"
import { queryCheck, get } from "../api/controller"

import { post_settings } from "./post"

const theme = schema({
  primary: "color",
  secondary: "color",
  font: { type: String }
})

const settings = schema({
  default_post_settings: post_settings
})

const user = api(
  "user",
  {
    id: { type: String, unique: true, required: true }, // used to identify user for authentication
    email: String,
    username: String,
    avatar: { type: String, default: undefined },
    theme,
    settings,
    pwd: {
      type: String,
      get: () => undefined
    }
  },
  { toJSON: { getters: true } }
)

user.router.add(async req => ({
  ...req.body,
  pwd: await secureHash(req.body.pwd)
}))

user.router.post("get", async (req, res) => {
  const docs = await user.query.getByIdList(req.body.ids, "id")

  return status(201, res, {
    users: docs.map(doc => ({ ...doc._doc, pwd: undefined }))
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
              id: doc.id,
              token: generateJwt(doc.id)
            })

          if (!req.body.pwd) return deny()
          const result = await verifyHash(req.body.pwd, doc.pwd)

          switch (result) {
            case securePass.VALID:
              return accept()

            case securePass.VALID_NEEDS_REHASH:
              doc.hash = await secureHash(req.body.pwd)
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
  useAuth(
    async (req, res, user_id) =>
      await get({
        req,
        res,
        model: user.model,
        query: {
          id: req.body.id
        },
        cb: async function (err, doc) {
          if (!queryCheck(res, err, doc)) {
            if (doc.id === user_id) return status(200, res, { data: doc })
            return status(401, res, { message: "NOT_AUTHORIZED" })
          }
        }
      })
  )
)

export default user
