import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ThemeProvider from "feature/theme"
import Page from "."
import Body from "feature/body"
import Post from "feature/post"
import Button from "component/button"
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
        <div className={bss("header")}>
          <div className={bss(tags ? "query" : "title")}>
            {tags ? `# ${tags.split(",").join(" ")}` : "Latest posts"}
          </div>
          {user && tags && (
            <Button
              icon={following ? "Remove" : "Add"}
              title={following ? "Unfollow" : "Follow"}
              onClick={follow}
              color="primary"
            />
          )}
        </div>
        <div
          className={bss("posts", {
            loading: !posts,
            empty: posts && posts.length === 0
          })}
        >
          {posts
            ? posts.map(p => (
                <ThemeProvider key={p._id} theme={p.user.theme}>
                  <Post data={p} size="small" />
                </ThemeProvider>
              ))
            : "loading..."}
          {posts && posts.length === 0 && "No posts yet..."}
        </div>
      </Body>
    </Page>
  )
}

export default PageExplore
