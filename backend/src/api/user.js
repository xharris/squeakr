const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const schema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  email: String,
  username: String
})

const model = mongoose.model("User", schema)

const controller = {
  add: (req, res) =>
    model.create({
      ...req.body
    }),
  get: (req, res) => {
    model.findById(id, (err, user) => (!err ? res.send(user) : null))
  },
  addChild: (req, res) => {
    model.create
  }
}

module.exports = { schema, model, controller, router }
