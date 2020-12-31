require("dotenv").config()
const { backend } = require("./api")

backend.start({
  name: "squeakr",
  port: 3000,
  whitelist: [process.env.REACT_DB_HOST],
  skip_recursive_require: true
  //debug: true
})
