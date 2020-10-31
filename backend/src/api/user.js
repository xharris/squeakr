import api from "."

import {
  securePass,
  secureHash,
  verifyHash,
  status,
  randomColor
} from "../util"
import { generateJwt, useJwt } from "../jwt"

const user = api("user", {
  id: { type: String, unique: true, required: true }, // used to identify user for authentication
  email: String,
  username: String,
  avatar: { type: String, default: undefined },
  color: { type: String, default: "#CFD8DC" },
  pwd: String
})

user.router.add(async req => ({
  ...req.body,
  color: req.body.color || randomColor(),
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
  "/login",
  async (req, res) =>
    await get({
      req,
      res,
      model,
      query: {
        id: req.body.id
      },
      cb: async function (err, doc) {
        if (!queryCheck(res, err, doc)) {
          const deny = () => status(403, res, { message: `Invalid login` })
          const accept = () =>
            status(201, res, {
              id: doc._id,
              token: generateJwt(doc._id)
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

user.router.post("/verify", (req, res) =>
  status(201, res, { message: "token is good" })
)

export const { model } = user
