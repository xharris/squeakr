export const getCheck = (name, err, instance) =>
  err || !instance
    ? status(400, res, { error: err || `${name} not found` })
    : status(200, res, { data: instance })

export const status = (code, res, props) =>
  res ? res.status(code).json({ ...props }) : { code: code, ...props }
export const prep_new_instance = doc => {
  doc.date_created = Date.now()
  doc.date_modified = Date.now()
  return doc
}
export const instance_modified = doc => {
  doc.date_modified = Date.now()
  return doc
}
