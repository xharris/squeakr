import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import Post from "feature/post"
import * as apiPost from "api/post"
import { useFetch, useQuery } from "util"
import { block } from "style"

const bss = block("page_explore")

const PageExplore = () => {
  const { params } = useQuery()
  const [posts, fetch] = useFetch(tags =>
    apiPost.getTag(tags).then(res => res.data.docs)
  )

  useEffect(() => {
    if (params) {
      console.log(params.get("tags"))
      fetch(params.get("tags").split(",")).then(res => console.log(res))
    }
  }, [params])

  return (
    <Page className={bss()}>
      <Body>
        {posts
          ? posts.map(p => (
              <Post key={p._id} data={p} theme={p.user.theme} size="small" />
            ))
          : "loading"}
      </Body>
    </Page>
  )
}

export default PageExplore
