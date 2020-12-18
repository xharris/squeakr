require("dotenv").config()
const { backend } = require("./api")

backend.start({
  name: "squeakr",
  port: 3000,
  whitelist: ["http://localhost:3000", "http://localhost:3001"],
  skip_recursive_require: true
  //debug: true
})
