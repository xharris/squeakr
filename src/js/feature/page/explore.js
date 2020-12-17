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
import { useQuery } from "util"
import { block } from "style"

const bss = block("page_explore")

const PageExplore = () => {
  const { params } = useQuery()
  const [tags, setTags] = useState()

  useEffect(() => {
    if (params && params.get("tags")) setTags(params.get("tags"))
    else setTags()
  }, [params])

  return (
    <Page className={bss()}>
      <Body>
        <PostView query={{ tags: tags && tags.split(",") }} />
      </Body>
    </Page>
  )
}

export default PageExplore
