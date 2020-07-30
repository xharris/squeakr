// eslint-disable-next-line no-native-reassign
require = require("esm")(module)
require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

const apiPort = 3000
const whitelist = ["http://localhost:3000", "http://localhost:3001"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}
const db_heroku = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
}

const db_local = {
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "test"
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
  .connect("mongodb://127.0.0.1:27017/kanban", {
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

const api = ["card"]
api.forEach(a => app.use("/api", require(`./api/${a}`).router))

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
