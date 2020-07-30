import { status } from "../util"
import { queryCheck, add, updateById, getById } from "../controller"

const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const attributeSchema = new mongoose.Schema({
  type: { type: String },
  value: { type: String },
  color: { type: String }
})

const schema = new mongoose.Schema({
  type: { type: String },
  title: { type: String },
  small: {
    show: { type: [String] }
  },
  attributes: [attributeSchema],
  permissions: {
    view: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    edit: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    delete: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }
  },
  children: { type: [mongoose.Schema.Types.ObjectId], ref: "Card" },
  value: { type: String },
  color: { type: String, default: "#ECEFF1" }
})

const model = mongoose.model("Card", schema)

const controller = {
  add: (req, res) =>
    add({
      req,
      res,
      model,
      name: "Card",
      body: () => ({ type: "card", ...req.body })
    }),
  edit: (req, res) =>
    updateById({
      req,
      res,
      model,
      id: req.params.id
    }),
  get: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model
      .findById(req.params.id)
      .populate("children")
      .exec(function (err, doc) {
        if (!queryCheck(err, doc)) {
          status(201, res, {
            data: doc
          })
        }
      })
  },
  addChild: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model.findById(req.params.id).exec(async function (err, doc) {
      if (!queryCheck(err, doc)) {
        console.log(doc.children, doc.children.indexOf(req.params.child_id))
        if (doc.children.indexOf(req.params.child_id) === -1) {
          doc.children.push(req.params.child_id)
          await doc.save()
          status(201, res, { message: `Child card added!` })
        } else {
          status(201, res, { message: `Child card already added.` })
        }
      }
    })
  }
}

router.post("/card/add", controller.add)
router.get("/card/:id", controller.get)
router.post("/card/:id/edit", controller.edit)
router.post("/card/:id/add/:child_id", controller.addChild)

module.exports = { schema, model, controller, router }
