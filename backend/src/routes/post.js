const { Api } = require("../api")
const { ref, status, queryCheck, types } = require("../api/util")
const { tag } = require("./tag")
const { group } = require("./group")
const { user } = require("./user")
const { follow } = require("./follow")
const { comment } = require("./comment")
const { post_settings } = require("./post_settings")

const post = new Api(
  "post",
  {
    content: { type: String, default: "", required: true },
    settings: post_settings,
    user: ref("user"),
    group: { type: [ref("group")], default: [] },
    mention: { type: [ref("user")], default: [] },
    comment: { type: [ref("comment")], default: [] },
    reaction: { type: [ref("reaction")], default: [] },
    views: { type: Number, default: 0 }
  },
  {
    schema: { toJSON: { getters: true }, toObject: { getters: true } }
  }
)
post.schema.index({ content: "text" })

post.auth.any = ["/add", "/update", "/delete", "/feed"]

post.router.post("/add", async (req, res) => {
  const [group, user] = Api.get("group", "user")
  const tags = req.body.tags || []

  const doc = await post.model.create({
    ...req.body,
    user: req.user._id,
    group: await Promise.all(
      tags
        .filter(m => m.type === "group")
        .map(
          async ({ value: name }) => await group.model.findOne({ name }).lean()
        )
    ),
    mention: await Promise.all(
      tags
        .filter(m => m.type === "user")
        .map(
          async ({ value: username }) =>
            await user.model.findOne({ username }).lean()
        )
    )
  })
  status(201, res, { _id: doc._id })
  post.emit("create", doc._id)
})

post.router.patch("/update", async (req, res) => {
  const [group, user] = Api.get("group", "user")
  const tags = req.body.tags || []

  post.model
    .findByIdAndUpdate(req.body._id, {
      ...req.body,
      group: await Promise.all(
        tags
          .filter(m => m.type === "group")
          .map(
            async ({ value: name }) =>
              await group.model.findOne({ name }).lean()
          )
      ),
      mention: await Promise.all(
        tags
          .filter(m => m.type === "user")
          .map(
            async ({ value: username }) =>
              await user.model.findOne({ username }).lean()
          )
      )
    })
    .exec((err, doc) => {
      if (!queryCheck(res, err, doc)) {
        status(200, res, { doc })
        post.emit("update", doc._id)
      }
    })
})

post.router.delete("/delete", (req, res) =>
  post.model
    .deleteOne({
      _id: req.body.id,
      user: req.user._id
    })
    .exec(err => {
      !queryCheck(res, err, true) && status(200, res)
      post.emit("delete", req.body.id)
    })
)

post.router.get("/user/:id", async (req, res) =>
  post.model
    .find({ user: await user.model.usernameToDocId(req.params.id) })
    .populate({ path: "user", model: user.model })
    .populate({ path: "group", model: group.model })
    .populate({ path: "mention", model: user.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
)

post.router.put("/viewed/:id", async (req, res) =>
  post.model.findById(req.params.id).exec((err, doc) => {
    if (!queryCheck(res, err, doc)) {
      doc.views++
      doc.save()
      status(200, res, { doc })
    }
  })
)

post.router.post("/tag", async (req, res) => {
  const tag_ids = await tag.model
    .find({
      value: { $in: req.body.tags },
      request: false
    })
    .select("_id")
    .exec()

  return post.model
    .find({ tags: { $all: tag_ids } })
    .populate({ path: "user", model: user.model })
    .populate({ path: "group", model: group.model })
    .populate({ path: "mention", model: user.model })
    .exec(
      (err, docs) => !queryCheck(res, err, docs) && status(200, res, { docs })
    )
})

post.router.get("/:id", async (req, res) =>
  post.model
    .findById(req.params.id)
    .populate({ path: "user", model: user.model })
    .populate({ path: "group", model: group.model })
    .populate({ path: "mention", model: user.model })
    .populate({ path: "comment", model: comment.model })
    .exec((err, doc) => !queryCheck(res, err, doc) && status(200, res, { doc }))
)

/* query
{
  usernames: [],
  user_ids: [],
  tags: [], // empty for all tags
  sort: '', // newest, oldest, controversial, popular
  following: t/f
}
*/
post.router.post("/query", async (req, res) => {
  const aggr = []

  // USERS
  const usernames = (req.body.usernames || []).filter(v => v != null)
  // const user_ids = (req.body.user_ids || []).filter(v => v != null)
  const group_names = (req.body.groups || []).filter(v => v != null)

  const all = usernames.length === 0 && group_names.length === 0

  const followed_users = (req.user
    ? await follow.model
        .find(
          {
            source_user: req.user._id,
            type: "user"
          },
          "user"
        )
        .lean()
    : await user.model
        .find(
          {
            private: false
          },
          "_id"
        )
        .lean()
  ).map(u => u.user || u._id)

  const users =
    usernames.length > 0 && !all
      ? (
          await user.model.find(
            {
              username: { $in: usernames },
              $or: [
                {
                  private: false
                },
                {
                  _id: { $in: followed_users }
                }
              ]
            },
            "_id"
          )
        ).map(u => u._id)
      : followed_users

  // GROUPS
  const followed_group_ids = req.user
    ? await follow.model
        .find(
          {
            source_user: req.user._id,
            type: "group",
            request: false
          },
          "group"
        )
        .lean()
    : []

  const groups = all
    ? followed_group_ids
    : (
        await group.model
          .find(
            {
              $or: [
                req.user
                  ? {
                      owner: req.user._id,
                      name: group_names.length > 0 && { $in: group_names }
                    }
                  : {
                      name: group_names.length > 0 && { $in: group_names },
                      privacy: "public"
                    },
                {
                  _id: { $in: followed_group_ids.map(g => g.group) },
                  name: group_names.length > 0 && { $in: group_names }
                }
              ]
            },
            "_id"
          )
          .lean()
      ).map(g => g._id)

  console.log("QUERY", req.body)
  if (all) console.log("ALL")
  console.log("USERS", users)
  console.log("GROUPS", groups)

  /*
  aggr.push(
    ...groups
      .filter(async g => {
        if (g.privacy === "private") {
          // is user allowed to look at this?
          return (
            req.user &&
            (await follow.model.exists({
              source_user: req.user._id,
              type: "group",
              group: g._id
            }))
          )
        }
        console.log("NO", g)
        return true
      })
      .map(g => ({ $match: { group: g._id } }))
  )
*/
  // ORDER
  if (req.body.order === "new") {
    aggr.push({ $sort: { date_created: -1 } })
  }
  if (req.body.order === "old") {
    aggr.push({ $sort: { date_created: 1 } })
  }
  if (req.body.order === "hot") {
    aggr.push(
      {
        $graphLookup: {
          from: "comment",
          startWith: "$comment",
          connectFromField: "comment",
          connectToField: "_id",
          as: "comments"
        }
      },
      {
        $set: {
          comment_len: { $size: { $ifNull: ["$comments", []] } }
        }
      },
      {
        $set: {
          actions: {
            $add: [
              "$comment_len",
              { $size: { $ifNull: ["$reaction", []] } },
              { $ifNull: ["$views", 0] }
            ]
          }
        }
      },
      {
        $set: {
          hot_value: {
            $cond: {
              if: { $gt: ["$actions", 0] },
              then: {
                $add: [
                  {
                    $log10: "$actions"
                  },
                  {
                    $divide: [
                      {
                        $multiply: [
                          {
                            $min: ["$actions", 1]
                          },
                          {
                            $millisecond: "$date_created"
                          }
                        ]
                      },
                      45000
                    ]
                  }
                ]
              },
              else: null
            }
          }
        }
      },
      {
        $unset: ["actions", "comments"]
      },
      { $sort: { hot_value: -1, date_created: -1 } }
    )
  }

  if (users.length > 0) {
    aggr.push({
      $match: {
        $expr: {
          $or: [
            // user wrote the post
            {
              $in: ["$user", users]
            },
            // user mentioned in post, author is querying user or followed user
            {
              $and: [
                ...users.map(uid => ({
                  $in: [uid, { $ifNull: ["$mention", []] }]
                })),
                {
                  $or: [
                    { $in: ["$user", followed_users] },
                    { $eq: ["$user", req.user && req.user._id] }
                  ]
                }
              ]
            }
          ]
        }
      }
    })
  }

  aggr.push(
    {
      $set: {
        visible_group: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$group", []] } }, 0] },
            then: {
              $or: groups.map(gid => ({ $in: [gid, "$group"] }))
            },
            else: groups.length === 0
          }
        }
      }
    },
    {
      $match: {
        $or:
          all && req.user
            ? [{ visible_group: true }, { user: req.user._id }]
            : [{ visible_group: true }]
      }
    }
  )

  if (req.body.skip + req.body.limit > 0)
    aggr.push({ $limit: req.body.skip + req.body.limit })
  aggr.push({ $skip: req.body.skip })

  post.model.aggregate(aggr).exec(async (err, docs) => {
    if (!err) {
      if (req.body.size === "small") {
        docs = docs.map(p => {
          p.content = p.content.slice(0, 300)
          return p
        })
      }
    }
    return (
      !queryCheck(res, err, docs) &&
      status(200, res, { docs, end: docs && docs.length === 0 })
    )
  })
})

module.exports = { post, post_settings }
