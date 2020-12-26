import * as api from "."

export const post = (postid, reaction) =>
  reaction ? api.put("reaction/post", {}) : api.get("reaction/post")
