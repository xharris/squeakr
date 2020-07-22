const { resolve } = require("path")

module.exports = {
  webpack: {
    alias: {
      component: resolve(__dirname, "./src/js/component"),
      view: resolve(__dirname, "./src/js/view"),
      api: resolve(__dirname, "./src/js/api"),
      util: resolve(__dirname, "./src/js/util"),
      style: resolve(__dirname, "./src/style")
    }
  }
}
