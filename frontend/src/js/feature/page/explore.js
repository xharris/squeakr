import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ThemeProvider from "feature/theme"
import Page from "."
import Body from "feature/body"
import Post from "feature/post"
import { useAuthContext } from "component/auth"
import * as apiPost from "api/post"
import { useFetch, useQuery } from "util"
import { block } from "style"

const bss = block("page_explore")

const PageExplore = () => {
  const { user } = useAuthContext()
  const { params } = useQuery()
  const [posts, fetch] = useFetch(tags =>
    tags
      ? apiPost.getTag(tags).then(res => res.data.docs)
      : apiPost.feed().then(res => res.data.docs)
  )
  const [tags, setTags] = useState()

  useEffect(() => {
    if (params && params.get("tags")) setTags(params.get("tags"))
    else setTags()
  }, [params])

  useEffect(() => {
    if (tags) {
      fetch(tags.split(",")).then(res => console.log(res))
    } else if (user) {
      fetch().then(res => console.log(res))
    }
  }, [tags, user])

  return (
    <Page className={bss()}>
      <ThemeProvider>
        <Body>
          <div className={bss("query")}>
            {tags ? `# ${tags.split(",").join(" ")}` : "Latest posts"}
          </div>
          <div
            className={bss("posts", {
              loading: !posts,
              empty: posts && posts.length === 0
            })}
          >
            {posts
              ? posts.map(p => (
                  <Post
                    key={p._id}
                    data={p}
                    theme={p.user.theme}
                    size="small"
                  />
                ))
              : "loading..."}
            {posts && posts.length === 0 && "No posts yet..."}
          </div>
        </Body>
      </ThemeProvider>
    </Page>
  )
}

export default PageExplore
