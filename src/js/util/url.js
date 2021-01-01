const server_url = "localhost:3000"

export const card = id => `/card/${id}`
export const user = id => `/u/${id}`
export const post = id => `/p/${id}`
export const settings = () => `/settings`
export const home = () => "/"
export const explore = ({ group } = {}) =>
  group ? `/explore?group=${group}` : "/explore"
export const tag = ({ username, tags }) =>
  username
    ? `/u/${username}?tags=${tags.join(",")}`
    : `/explore?tags=${tags.join(",")}`
export const image = id => `${server_url}/file/${id}`
