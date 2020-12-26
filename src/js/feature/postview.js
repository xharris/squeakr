import React, { useState, useEffect, useCallback } from "react"
import { useQuery } from "util"
import Post from "feature/post"
import Text from "component/text"
import ThemeProvider, { useThemeContext } from "feature/theme"
import { useSettingsContext } from "component/settings"
import Search from "component/search"
import PostEditModal from "feature/posteditmodal"
import PostViewModal from "feature/postviewmodal"
import Group from "feature/group"
import PostInput from "feature/postinput"
import { useListen } from "util"
import * as apiPost from "api/post"
import * as suggest from "feature/suggestion"
import { cx, block } from "style"

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

const PostView = ({ query: _query = {}, className, nolimit }) => {
  const [ls_postview, ls_set_postview] = useSettingsContext("postview")
  const [ls_postviewui] = useSettingsContext("postview_ui")
  const [query, setQuery] = useState({})
  const [posts, setPosts] = useState()
  const [size] = useState(ls_postview.size)
  const { params } = useQuery()
  // prevents showing posts before query parameters are loaded
  const [loadCount, setLoadCount] = useState(0)
  const [postModal, setPostModal] = useState()
  const [viewingPost, setViewingPost] = useState()
  const [group, setGroup] = useState()
  const [subtitle, setSubtitle] = useState("")
  const [deleted, setDeleted] = useState({})
  const { theme } = useThemeContext()

  // on view settings change
  useEffect(() => {
    setQuery({
      ...query,
      ...ls_postview
    })
    setLoadCount(loadCount + 1)
  }, [ls_postview, ls_postviewui])

  // change title when query changes
  useEffect(() => {
    let new_title = []
    if (_query.usernames && _query.usernames.length > 0) {
      new_title.concat(_query.usernames.map(u => `@${u.label}`))
    }
    setSubtitle(new_title.join(","))
  }, [_query])

  useEffect(() => {
    setQuery({ ...query, groups: [group] })
    setLoadCount(loadCount + 1)
  }, [group])

  const performQuery = useCallback(() => {
    const real_query = { groups: _query.groups || [], ...query }
    if (_query.usernames) {
      if (!real_query.usernames) real_query.usernames = []
      _query.usernames.forEach(u => {
        if (!real_query.usernames.includes(u.value))
          real_query.usernames.push(u.value)
      })
    }
    if (group) {
      real_query.groups = [...real_query.groups, group]
    }
    apiPost.query(real_query).then(res => {
      setPosts(res.data.docs)
    })
  }, [query])

  // perform the query
  useEffect(() => {
    if (loadCount > 2 || (!group && loadCount > 1)) performQuery()
  }, [query, group, loadCount])

  // update query because of remote change
  useListen("post/create", performQuery)
  useListen("post/delete", id => {
    if (viewingPost === id) setViewingPost()
    setDeleted({
      ...deleted,
      [id]: true
    })
  })

  useEffect(() => {
    if (size != null) ls_set_postview("size", size)
  }, [size])

  useEffect(() => {
    if (params && params.get("group")) {
      const name = params.get("group")
      setGroup(name)
    } else {
      setGroup()
    }
  }, [params])

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
          {group ? (
            <Group color="primary" bg="secondary" name={group} hideJoined />
          ) : (
            <Text
              className={bss("title")}
              color="primary"
              bg="secondary"
              themed
            >
              {group
                ? `#${group}`
                : _query.usernames && _query.usernames.length === 1
                ? _query.usernames[0].label
                : "All"}
            </Text>
          )}
          <Search
            className={bss("search")}
            placeholder="user: / group: / text: / media:"
            inactiveText={subtitle}
            blocks={[/\b(user|text|media|group):/]}
            suggestion={{
              user: suggest.user,
              media: suggest.media,
              group: suggest.group
            }}
            onSearch={terms => {
              setQuery({
                groups: [
                  group,
                  ...terms.filter(t => t.type === "group").map(t => t.value)
                ],
                usernames: terms
                  .filter(t => t.type === "user")
                  .map(t => t.value),
                content: terms.filter(t => t.type === "text").map(t => t.value)
              })
            }}
          />
        </ThemeProvider>
      </div>
      <PostInput />
      <PostEditModal
        data={{ groups: [group] }}
        open={postModal}
        onClose={setPostModal}
      />
      <div className={bss("posts")}>
        {posts
          ? posts
              .filter(p => !deleted[p._id])
              .map(p => (
                <ThemeProvider key={p._id} username={p.user.username}>
                  <Post
                    id={p._id}
                    data={p}
                    size={size}
                    onClick={() => setViewingPost(p._id)}
                    truncate
                  />
                  {viewingPost === p._id && (
                    <PostViewModal
                      open={viewingPost === p._id}
                      onClose={setViewingPost}
                      id={viewingPost}
                    />
                  )}
                </ThemeProvider>
              ))
          : "loading..."}
        {posts && posts.length === 0 && "No posts yet..."}
      </div>
    </div>
  )
}

export default PostView
