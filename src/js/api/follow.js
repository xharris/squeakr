import React, { useEffect, useState, useCallback } from "react"
import { useFetch, useUpdate, notify } from "util"
import * as api from "."

const followUser = username =>
  api.put(`follow/user/${username}`, {}, { withCredentials: true })

const followingUser = username =>
  api.post(`following/user/${username}`, {}, { withCredentials: true })

const unfollowUser = username =>
  api.put(`unfollow/user/${username}`, {}, { withCredentials: true })

// can be used for checking/updating following a single user
export const useFollowUser = username => {
  const [following, fetch] = useFetch(
    () => followingUser(username).then(res => res.data.following),
    "user_follow"
  )

  const [, update] = useUpdate({
    fn: () =>
      following
        ? unfollowUser(username).then(res => res.data)
        : followUser(username).then(res => res.data),
    type: "user_follow"
  })

  return [following, update, fetch]
}

export const followingUsers = username =>
  api.post(
    `following/users${username ? `/${username}` : ""}`,
    {},
    { withCredentials: true }
  )

const followTags = tags =>
  api.put(`follow/tags/${tags.join(",")}`, {}, { withCredentials: true })

const followingTags = tags =>
  api.post(
    `following/tags${tags ? "/" + tags.join(",") : ""}`,
    {},
    { withCredentials: true }
  )

const unfollowTags = tags =>
  api.put(`unfollow/tags/${tags.join(",")}`, {}, { withCredentials: true })

export const useFollowTagsAll = () =>
  useFetch(
    () => followingTags().then(r => r.data.docs),
    "tags_follow",
    null,
    []
  )

// tags should be a comma-separated string
export const useFollowTags = tags => {
  const [tagString, setTagString] = useState(tags)

  useEffect(() => {
    setTagString(tags.join(","))
  }, [tags])

  const [following, fetch] = useFetch(
    tlist => followingTags(tlist || []).then(res => res.data.following),
    "tags_follow",
    tagString
  )

  const update = useCallback(
    new_tags =>
      following
        ? unfollowTags(new_tags).then(res => {
            fetch(new_tags)
            notify("tags_follow", new_tags.join(","))
            return res.data
          })
        : followTags(new_tags).then(res => {
            fetch(new_tags)
            notify("tags_follow", new_tags.join(","))
            return res.data
          }),
    [following, tagString]
  )

  return [following, update, fetch]
}
