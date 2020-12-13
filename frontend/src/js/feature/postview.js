import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "util"
import { useAuthContext } from "component/auth"
import * as apiFollow from "api/follow"
import Post from "feature/post"
import Button from "component/button"
import Text from "component/text"
import TagInput from "feature/taginput"
import ThemeProvider from "feature/theme"
import * as apiPost from "api/post"
import { cx, block, css, pickFontColor } from "style"

const bss = block("postview")

/* query
{
  usernames: [], // list of usernames
  user_ids: [],
  tags: [], // empty for all tags
  sort: '', // newest, oldest, controversial, popular
  limit: 0
}
*/

const PostView = ({ query: _query, theme, className, nolimit, onSaveTags }) => {
  const [query, setQuery] = useState(_query)
  const [posts, setPosts] = useState()
  const [size, setSize] = useState("small")
  const [searching, setSearching] = useState()
  const [searchTags, setSearchTags] = useState()
  const { user } = useAuthContext()
  const { params } = useQuery()

  const [following, follow, checkFollowing] = apiFollow.useFollowTags(
    searchTags || []
  )

  useEffect(() => {
    apiPost.query(query).then(res => {
      setPosts(res.data.docs)
    })
  }, [query])

  useEffect(() => {
    if (params && params.get("tags"))
      setSearchTags(
        params
          .get("tags")
          .split(",")
          .map(t => ({ value: t }))
      )
    else setSearchTags()
  }, [params])

  useEffect(() => {
    if (searchTags) {
      setQuery({ ...query, tags: searchTags.map(t => t.value) })
      checkFollowing(searchTags)
    } else setQuery({ ...query, tags: null })
  }, [searchTags])

  return (
    <div
      className={cx(
        bss({
          loading: !posts,
          empty: posts && posts.length === 0
        }),
        className
      )}
    >
      <div className={bss("header")}>
        <ThemeProvider theme={theme}>
          <Text className={bss(searchTags ? "query" : "title")}>
            {searchTags
              ? `# ${searchTags.map(t => t.value).join(" ")}`
              : "Latest posts"}
          </Text>
          {user && searchTags && (
            <Button
              icon={following ? "Remove" : "Add"}
              title={following ? "Unfollow" : "Follow"}
              onClick={follow}
              color="primary"
            />
          )}
        </ThemeProvider>
      </div>
      <div className={bss("controls")}>
        <Button icon="ViewDay" title="Full" />
        <Button icon="ViewModule" title="Grid" />
        <Button icon="ViewStream" title="Rows" />
        {searching ? (
          <TagInput
            onChange={v => setSearchTags(v)}
            floatSuggestions
            nolimit={nolimit}
          />
        ) : (
          <Button
            icon="Search"
            title="Search"
            onClick={() => setSearching(true)}
          />
        )}
        {searching && (
          <Button
            icon="Close"
            title="Cancel"
            onClick={() => {
              setSearchTags()
              setSearching(false)
            }}
          />
        )}
      </div>
      <div className={bss("posts")}>
        {posts
          ? posts.map(p => (
              <ThemeProvider key={p._id} theme={p.user.theme}>
                <Post data={p} key={p._id} size={size} />
              </ThemeProvider>
            ))
          : "loading..."}
        {posts && posts.length === 0 && "No posts yet..."}
      </div>
    </div>
  )
}

export default PostView
