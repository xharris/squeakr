export const card = id => `/card/${id}`
export const user = id => `/u/${id}`
export const post = id => `/p/${id}`
export const settings = () => `/settings`
export const home = () => "/"
export const explore = ({ tags } = {}) =>
  tags ? `/explore?tags=${tags.join(",")}` : "/explore"
export const tag = ({ username, tags }) =>
  username
    ? `/u/${username}?tags=${tags.join(",")}`
    : `/explore?tags=${tags.join(",")}`
