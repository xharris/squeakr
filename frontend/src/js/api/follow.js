import React, { useEffect } from "react"
import { useFetch, useUpdate } from "util"
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
    "user_follow",
    username
  )

  const [, update] = useUpdate({
    fn: () =>
      following
        ? unfollowUser(username).then(res => res.data)
        : followUser(username).then(res => res.data),
    type: "user_follow",
    key: username
  })

  return [following, update, fetch]
}

export const followingUsers = username =>
  api.post(
    `following/users${username ? `/${username}` : ""}`,
    {},
    { withCredentials: true }
  )
