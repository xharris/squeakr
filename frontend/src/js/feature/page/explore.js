import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import Post from "feature/post"
import Button from "component/button"
import PostView from "feature/postview"
import { useAuthContext } from "component/auth"
import * as apiPost from "api/post"
import * as apiFollow from "api/follow"
import { useFetch, useQuery } from "util"
import { block } from "style"

const bss = block("page_explore")

const PageExplore = () => {
  const { user } = useAuthContext()
  const { params } = useQuery()
  const [posts, fetch] = useFetch(tstr =>
    tstr
      ? apiPost.getTag(tstr).then(res => res.data.docs)
      : apiPost.feed().then(res => res.data.docs)
  )
  const [tags, setTags] = useState()
  const [following, follow, checkFollowing] = apiFollow.useFollowTags(
    (tags || "").split(",")
  )

  useEffect(() => {
    if (params && params.get("tags")) setTags(params.get("tags"))
    else setTags()
  }, [params])

  useEffect(() => {
    if (tags) {
      fetch(tags.split(","))
      checkFollowing(tags && tags.split(","))
    } else if (user) {
      fetch()
    }
  }, [tags, user])

  return (
    <Page className={bss()}>
      <Body>
        <div className={bss("header")}></div>
        <PostView query={{ tags: tags && tags.split(",") }} />
      </Body>
    </Page>
  )
}

export default PageExplore
