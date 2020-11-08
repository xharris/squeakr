/**
 * Usage:
 *
 * import api, { schema, types } from "."
 *
 * const thing = schema({
 *   value: types.Mixed
 * })
 *
 * const new_api_table = api("new_api_table", {
 *   name: String,
 *   otherthing: { type: [thing], default: [] }
 * })
 *
 * new_api_table.router.add()
 *
 */

import {
  add,
  getAll,
  getById,
  updateById,
  removeById,
  queryCheck
} from "./controller"
import { randomColor, status } from "./util"

const nanoid = require("nanoid")
const mongoose = require("mongoose")
const express = require("express")
const { readdir } = require("fs")
const { join } = require("path")

export const types = mongoose.Schema.Types

export const checkSchema = (obj, ...args) => {
  for (const v in obj) {
    switch (obj[v]) {
      case "shortid":
        obj[v] = { type: String, default: () => nanoid(10) }
        break
      case "color":
        obj[v] = { type: String, default: () => randomColor() }
        break
    }
  }
  if (!obj.date_created) obj.date_created = Date
  if (!obj.date_modified) obj.date_modified = Date
  return obj
}
export const schema = (obj, options, ...args) =>
  new mongoose.Schema(
    checkSchema(obj),
    {
      ...options,
      timestamps: {
        createdAt: "date_created",
        updatedAt: "date_modified"
      }
    },
    ...args
  )

export const ref = (name, ...args) => ({
  type: mongoose.Types.ObjectId,
  ref: name,
  ...args
})

const api = (name, ...args) => {
  const router = express.Router()
  const _schema = schema(...args)
  const model = mongoose.model(name, _schema)
  backend.app.use("/api", router)

  return {
    model,
    schema: _schema,
    name,
    ref: { type: mongoose.Types.ObjectId, ref: name },

    // ROUTERS, built-in and extras
    router: {
      ...["get", "post", "put", "delete"].reduce((obj, route) => {
        obj[route] = (suffix, fn) =>
          router[route](
            `/${name}/${suffix}`,
            async (...args) => await fn(...args, model)
          )
        return obj
      }, {}),
      getBy: query =>
        router.get(
          `/${name}/get`,
          async (req, res) =>
            await getAll({
              res,
              model,
              query: query || req.body,
              cb: (err, docs) => {
                const r = queryCheck(res, err, docs)
                if (r) return r
                return status(201, res, {
                  data: docs
                })
              }
            })
        ),
      getById: doc =>
        router.get(
          `/${name}/:id`,
          async (req, res) =>
            await getById({ res, model, id: req.params.id, doc })
        ),
      add: body =>
        router.post(
          `/${name}/add`,
          async (req, res) =>
            await add({
              req,
              res,
              model,
              body
            })
        ),
      update: () =>
        router.post(
          `/${name}/update`,
          async (req, res) =>
            await updateById({
              req,
              res,
              model,
              id: req.body.id || req.body._id
            })
        )
    },

    // QUERIES for convenience
    query: {
      getByIdList: async (list, key) =>
        await model
          .find()
          .where(key || "_id")
          .in(list)
          .exec(),
      findById: async (req, res, id) => {
        id = id || req.params.id
        if (!id) return status(400, res, { message: `Provide id` })
        return await model.findById(id).exec(function (err, doc) {
          if (!queryCheck(res, err, doc)) {
            status(201, res, {
              data: doc
            })
          }
        })
      },
      updateById: async (req, res, id) => {
        id = id || req.params.id
        if (!id) return status(400, res, { message: `Provide id` })
        return await updateById({
          req,
          res,
          model,
          id
        })
      },
      removeById: async (req, res, id) => {
        id = id || req.params.id
        if (!id) return status(400, res, { message: `Provide id` })
        return await removeById({
          req,
          res,
          model,
          id
        })
      }
    }
  }
}

export const backend = {
  start: options => {
    const express = require("express")
    const bodyParser = require("body-parser")
    const cors = require("cors")
    const app = express()

    backend.app = app

    const { port, whitelist } = options

    const corsOptions = {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      }
    }

    const helmet = require("helmet") // creates headers to protect from attacks
    const morgan = require("morgan") // logs requests. ok??
    const csp = require("helmet-csp")
    app.use(helmet())
    app.use(cors(corsOptions))
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    )
    app.use(
      bodyParser.json({
        limit: "8mb",
        extended: true
      })
    )
    app.use(morgan("combined")) // tiny/combined
    app.use(
      csp({
        directives: {
          defaultSrc: [`'self'`],
          imgSrc: [`'self'`]
        }
      })
    )

    const mongoose = require("mongoose")
    mongoose.set("debug", options.debug)
    mongoose.set("useFindAndModify", false)
    mongoose
      .connect(`mongodb://127.0.0.1:27017/${options.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(e => {
        console.error("Connection error", e.message)
      })
    mongoose.set("useCreateIndex", true)
    mongoose.pluralize(null)
    const db = mongoose.connection

    db.on("error", console.error.bind(console, "MongoDB connection error:"))

    app.get("/", (req, res) => {
      res.send("Hello Warudo!")
    })

    const requireDir = (dir, no_recursion) =>
      new Promise((res, rej) => {
        readdir(dir, { withFileTypes: true }, (err, files) => {
          if (err) return rej()
          const imports = []
          files.forEach(f => {
            if (f.isDirectory() && !no_recursion) requireDir(join(dir, f.name))
            else if (f.isFile() && f.name !== "index.js") {
              imports.push(join(dir, f.name))
            }
          })
          Promise.all(imports.map(f => import(f)))
            .then(res)
            .catch(console.error)
        })
      })

    requireDir(
      join(__dirname, "../routes"),
      options.skip_recursive_require
    ).then(data => {
      app.listen(port, () => console.log(`Server running on port ${port}`))
    })
  }
}

export default api
