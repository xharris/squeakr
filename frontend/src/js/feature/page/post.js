import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "."
import Post from "feature/post"
import Body from "feature/body"
import Avatar from "feature/avatar"
import Button from "component/button"
import * as apiPost from "api/post"
import { useFetch, useUpdate } from "util"
import { block } from "style"

const bss = block("page_post")

const PagePost = () => {
  const { post: post_id } = useParams()
  const [data, fetch] = useFetch(id => apiPost.get(id))
  useEffect(() => {
    fetch(post_id)
  }, [post_id])

  useEffect(() => {
    console.log(data)
  }, [data])

  return data ? (
    <Page className={bss()} theme={data.user.theme}>
      <Body className={bss("body")}>
        <Post size="full" data={data} theme={data.user.theme} />
        <div className={bss("author_container")}>
          <div className={bss("author")}>
            <Avatar user={data.user} />
          </div>
          <div className={bss("reactions")}>
            <Button
              className={bss("reaction")}
              label="👍"
              onClick={() => {}}
              color={data.user.theme.secondary}
              outlined
            />
          </div>
        </div>
      </Body>
    </Page>
  ) : null
}

export default PagePost
