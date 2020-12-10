const { Api, express } = require("../api")
const { status } = require("../api/util")

const file = new Api("file", {
  data: Buffer,
  size: Number,
  md5: { type: String, unique: true },
  encoding: String,
  mimetype: String
})

file.auth.any = ["/upload"]

file.use("/v", express.static("./files"))

file.router.post("/upload", async (req, res) => {
  const { name, data, size, md5, encoding, mimetype, mv } = req.files.file
  const file_url = id =>
    req.protocol +
    "://" +
    req.get("host") +
    req.baseUrl +
    "/" +
    (mimetype.startsWith("video") ? "v" : "img") +
    "/" +
    id

  // does file already exist?
  var doc = await file.model.findOne({ md5 }).exec()
  if (doc) return status(201, res, { name, doc, url: file_url(doc._id) })

  const big_file = size > 16000000

  if (mimetype.startsWith("video")) {
    // host statically
    return mv("./files/" + name).then(() =>
      status(201, res, {
        name,
        url: file_url(name)
      })
    )
  } else if (big_file) {
    // GridFS
    console.log("FILE TOO BIG")
  } else {
    doc = await file.model.create({ data, size, md5, encoding, mimetype })
    return doc
      ? status(201, res, {
          name,
          url: doc && file_url(doc._id),
          doc
        })
      : status(400, res, {
          name
        })
  }
})

file.router.get("/img/:id", (req, res) =>
  file.model
    .findById(req.params.id)
    .exec((err, doc) =>
      !err && doc
        ? res.status(201).type(doc.mimetype).send(doc.data)
        : res.status(201).end()
    )
)

module.exports = { file }
