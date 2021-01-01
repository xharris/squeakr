import * as apiGroup from "api/group"
import * as apiUser from "api/user"

export const toGroup = name => ({
  icon: "Group",
  type: "group",
  label: name,
  value: name
})

export const toMedia = v => ({
  icon: "PermMedia",
  type: "media",
  label: v,
  value: v
})

export const toUser = ({ display_name, username }) => ({
  icon: "AlternateEmail",
  type: "user",
  label: display_name,
  value: username
})

export const user = (cb, term) => {
  apiUser.search(term).then(res => cb(res.data.docs.map(u => toUser(u))))
}

export const media = (cb, term) => {
  const choices = ["video", "image", "youtube"]
  cb(choices.filter(c => c.includes(term)).map(c => toMedia(c)))
}

export const group = (cb, term) => {
  apiGroup.search(term).then(res => cb(res.data.docs.map(g => toGroup(g.name))))
}
