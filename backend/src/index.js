require("dotenv").config()
const { backend } = require("./api")

backend.start({
  mongo_url:
    process.env.NODE_ENV === "development"
      ? "mongodb://localhost:27017/squeakr"
      : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/squeakr?retryWrites=true&majority`,
  port: 3000,
  whitelist: ["http://localhost:3000", "http://localhost:3001"],
  skip_recursive_require: true
  //debug: true
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
