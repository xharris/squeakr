import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "."
import Post from "feature/post"
import Body from "feature/body"
import ThemeProvider from "feature/theme"
import * as apiPost from "api/post"
import { useFetch } from "util"
import { block } from "style"

const bss = block("page_post")

const PagePost = () => {
  const { post: post_id } = useParams()
  const [data, fetch] = useFetch(id => apiPost.get(id))
  useEffect(() => {
    fetch(post_id)
  }, [post_id])

  return data ? (
    <ThemeProvider username={data && data.user.username}>
      <Page className={bss()} title={`${data.user.username}'s post`}>
        <Body className={bss("body")} size="md">
          <Post size="full" data={data} />
        </Body>
      </Page>
    </ThemeProvider>
  ) : null
}

export default PagePost
