import { status, prep_new_instance, instance_modified } from "./util"

export const queryCheck = (res, err, doc) => {
  if (err) return status(404, res, { message: `Not found!` })
  if (!doc) return status(400, res, { message: err })
}

export const add = ({ req, res, model, name, body }) => {
  if (!req.body)
    return status(400, res, { message: `Please provide ${name} data` })
  model.create(body ? body() : req.body, async function (err, doc) {
    const r = queryCheck(res, err, doc)
    if (r) return r
    prep_new_instance(doc)
    await doc.save()
    return status(201, res, {
      id: doc._id,
      message: `entry created!`
    })
  })
}

export const updateById = ({ req, res, model, id, bodyMod }) => {
  if (!req.body)
    return status(400, res, { message: `Provide a body to update` })
  model.findById(id, async function (err, doc) {
    const r = queryCheck(res, err, doc)
    if (r) return r
    instance_modified(doc)
    // use req.body to modify doc
    var body = req.body
    for (const key in body) {
      doc[key] = body[key]
    }
    if (bodyMod) bodyMody(body)
    // finalize changes
    await doc.save()
    return status(201, res, {
      id: doc._id,
      message: `edit successful!`
    })
  })
}

export const getById = async ({ res, model, id }) => {
  if (!id) return status(400, res, { message: `Provide id` })
  return await model.findById(id).exec(function (err, doc) {
    return (
      queryCheck(res, err, doc) ||
      status(201, res, {
        data: doc
      })
    )
  })
}

export const getAll = async ({ req, res, model, query }) => {
  if (!query) return status(400, res, { message: `Provide query parameters` })
  return await model.find(query)
}

export const removeById = async ({ res, model, id }) => {
  if (!id) return status(400, res, { message: `Provide id` })
  return await model.deleteOne({ _id: id }).exec(function (err) {
    if (err) return status(400, res, { message: err })
    else
      return status(201, res, {
        message: `removal successful!`
      })
  })
}
