export const securePass = require("secure-password")
const pwd = securePass()

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

export const secureHash = async str => await pwd.hash(Buffer.from(str))
export const verifyHash = async (str, hash) =>
  await pwd.verify(Buffer.from(str), Buffer.from(hash))
