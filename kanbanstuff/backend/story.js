import api, { schema } from "."
import { status } from "../util"

const task = schema({
  _id: "shortid",
  body: { type: String },
  checked: { type: Boolean }
})

const block = schema({
  _id: "shortid",
  title: { type: String },
  list: { type: [task] },
  assignee: {}
})

const story = api("story", {
  _id: "shortid",
  title: { type: String, default: "New story" },
  color: { type: String, default: "#E0E0E0" },
  blocks: { type: [block] }
})

story.router.getById()
story.router.update()
story.router.add()
story.router.post("get", async (req, res) =>
  status(201, res, {
    stories: await story.query.getByIdList(req.body.id, "_id")
  })
)
