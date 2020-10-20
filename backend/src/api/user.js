import { queryCheck, get, add } from "../controller"
import { securePass, secureHash, verifyHash, status } from "../util"
import { generateJwt, useJwt } from "../jwt"

const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const schema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // used to identify user for authentication
  email: String,
  username: String,
  avatar: String,
  pwd: String
})

export const model = mongoose.model("User", schema)

const controller = {
  add: async (req, res) =>
    await add({
      req,
      res,
      model,
      name: "User",
      body: async () => ({
        ...req.body,
        pwd: await secureHash(req.body.pwd)
      })
    }),
  login: async (req, res) =>
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
    }),
  verify: (req, res) => status(201, res, { message: "token is good" }),
  get: () => {}
}

router.post("/user/add", controller.add)
router.post("/user/login", controller.login) // { id, pwd } returns jwt
router.post("/user/verify", useJwt(controller.verify)) // { id, token }

module.exports = { schema, model, controller, router }
