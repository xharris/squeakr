// eslint-disable-next-line no-native-reassign
require = require("esm")(module)
require("dotenv").config()

const backend = require("./api")

backend.start({
  name: "emr",
  port: 3000,
  whitelist: ["http://localhost:3000", "http://localhost:3001"],
  skip_recursive_require: true
})

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
