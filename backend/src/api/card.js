import { status } from "../util"
import { queryCheck, add, updateById, removeById } from "../controller"

const shortid = require("shortid")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  type: { type: String, default: "card" },
  title: { type: String, default: "New card" },
  small: {
    show: { type: [String] }
  },
  permissions: {
    view: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    edit: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    delete: { type: [mongoose.Schema.Types.ObjectId], ref: "User" }
  },
  children: { type: [String], ref: "Card" },
  value: { type: String },
  color: { type: String, default: "#e0e0e0" },
  created_by: { type: String, ref: "User" }
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
  remove: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model
      .findByIdAndDelete(req.params.id)
      .populate("children")
      .exec(function (err, doc) {
        if (!queryCheck(res, err, doc)) {
          return (
            Promise.all(
              doc.children.map(
                async child =>
                  child.type !== "card" &&
                  (await model.findByIdAndDelete(child).exec())
              )
            )
              // get a list of cards who has this card as a child
              .then(() => model.find({ children: req.params.id }).exec())
              .then(parents =>
                status(201, res, {
                  data: doc,
                  parents
                })
              )
          )
        }
      })
  },
  get: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model
      .findById(req.params.id)
      .populate("children")
      .exec(function (err, doc) {
        if (!queryCheck(res, err, doc)) {
          status(201, res, {
            data: doc
          })
        }
      })
  },
  getUser: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide user id` })
    return await model
      .find({
        created_by: req.params.id
      })
      // .populate("children") // TODO make populate children optional
      .exec(function (err, docs) {
        if (!queryCheck(res, err, docs)) {
          status(201, res, {
            data: docs
          })
        }
      })
  },
  addChild: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model.findById(req.params.id).exec(async function (err, doc) {
      if (!queryCheck(res, err, doc)) {
        if (doc.children.indexOf(req.params.child_id) === -1) {
          doc.children.push(req.params.child_id)
          await doc.save()
          status(201, res, { message: `Child card added!` })
        } else {
          status(201, res, { message: `Child card already added.` })
        }
      }
    })
  },
  removeChild: async (req, res) => {
    if (!req.params.id) return status(400, res, { message: `Provide id` })
    return await model.findById(req.params.id).exec(async function (err, doc) {
      if (!queryCheck(res, err, doc)) {
        if (doc.children.indexOf(req.params.child_id) > -1) {
          doc.children = doc.children.filter(id => id != req.params.child_id)
          await doc.save()
          status(201, res, { message: `Child card remove!` })
        } else {
          status(201, res, { message: `Child card does not exist.` })
        }
      }
    })
  }
}

router.post("/card/add", controller.add)
router.get("/card/:id", controller.get)
router.get("/card/user/:id", controller.getUser)
router.post("/card/:id/edit", controller.edit)
router.post("/card/:id/add/:child_id", controller.addChild)
router.post("/card/:id/remove/:child_id", controller.removeChild)
router.post("/card/:id/remove", controller.remove)

module.exports = { schema, model, controller, router }
