import { add, getById, updateById, removeById } from "../controller"
import { randomColor } from "../util"

const nanoid = require("nanoid")
const mongoose = require("mongoose")
const express = require("express")
const { readdir } = require("fs")
const { join } = require("path")

export const types = mongoose.Schema.Types

export const checkSchema = obj => {
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

  return new mongoose.Schema(obj)
}
export const schema = checkSchema

const api = (name, schema) => {
  const router = express.Router()
  schema = checkSchema(schema)
  const model = mongoose.model(name, schema)

  backend.app.use("/api", router)

  return {
    model,
    schema,
    name,

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

export default api

const backend = {
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

    const requireDir = (dir, no_recursion) => {
      readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) return
        files.forEach(f => {
          if (f.isDirectory() && !no_recursion) requireDir(join(dir, f.name))
          else if (f.isFile() && f.name !== "index.js")
            require(join(dir, f.name))
        })
      })
    }

    requireDir(__dirname, options.skip_recursive_require)

    app.listen(port, () => console.log(`Server running on port ${port}`))
  }
}

module.exports = backend
