export const card = id => `/card/${id}`
export const user = id => `/u/${id}`
export const post = id => `/p/${id}`
export const settings = () => `/settings`
export const explore = ({ tags }) => `/explore?tags=${tags.join(",")}`
