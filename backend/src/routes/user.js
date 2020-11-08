import api, { checkSchema } from "../api"
import {
  securePass,
  secureHash,
  verifyHash,
  status,
  randomColor
} from "../api/util"
import { generateJwt, verifyJwt } from "../api/jwt"
import { queryCheck, get, updateOne } from "../api/controller"

import { post_settings } from "./post"

/**
 * apivar.router.post("dothing", useAuth(async (req, res, user_id) => await get({ ... })))
 */
export const useAuth = ctrl_fn => {
  return function (req, res, ...args) {
    const deny = res => status(403, res, { message: "BAD_TOKEN" })
    const { token } = req.body
    delete req.body.token
    if (!token) return deny() // no id or token given
    return new Promise((pres, rej) => {
      // decode the jwt
      verifyJwt(token, (err, data) => {
        if (err) return deny()
        //if (data.data !== id) return deny() // incorrect user
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

const user = api(
  "user",
  {
    _id: "shortid",
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
  { toJSON: { getters: true }, toObject: { getters: false } }
)

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

export default user
