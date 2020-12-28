import React, { useState, useEffect, useCallback } from "react"
import { useQuery } from "util"
import Post from "feature/post"
import Text from "component/text"
import ThemeProvider from "feature/theme"
import { useSettingsContext } from "component/settings"
import Search from "component/search"
import PostViewModal from "feature/postviewmodal"
import Group from "feature/group"
import PostInput from "feature/postinput"
import Button from "component/button"
import { useListen } from "util"
import * as apiPost from "api/post"
import * as apiUser from "api/user"
import * as suggest from "feature/suggestion"
import StackGrid from "react-stack-grid"
import { useParams } from "react-router-dom"
import { useAuthContext } from "component/auth"
import { cx, css, block } from "style"

const bss = block("postview")

const DEFAULT_LIMIT = 5

/* query
{
  usernames: [], // list of usernames
  user_ids: [],
  tags: [], // empty for all tags
  sort: '', // newest, oldest, controversial, popular
  limit: 0
}
*/

const PostView = ({ theme, query: _query = {}, className }) => {
  const [ls_postview, ls_set_postview] = useSettingsContext("postview")
  const [ls_postviewui] = useSettingsContext("postview_ui")
  const [query, setQuery] = useState({})
  const [posts, setPosts] = useState([])
  const { params } = useQuery()
  // prevents showing posts before query parameters are loaded
  const [loadCount, setLoadCount] = useState(0)
  const [viewingPost, setViewingPost] = useState()
  const [group, setGroup] = useState()
  const [subtitle, setSubtitle] = useState("")
  const [deleted, setDeleted] = useState({})
  const { user: username } = useParams()
  const [userData, setUserData] = useState() // if viewing a user's page
  const { user } = useAuthContext()
  const [searching, setSearching] = useState()
  const [lastView, setLastView] = useState(ls_postview.view_type)
  const [viewType, setViewType] = useState(ls_postview.view_type)
  const [viewMore, setViewMore] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    if (username && user && username !== user.username)
      apiUser.get(username).then(res => {
        if (res.data.users.length > 0) setUserData(res.data.users[0])
      })
  }, [username, user])

  // on view settings change
  useEffect(() => {
    setViewType(ls_postview.view_type)
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

  const performQuery = useCallback(
    ({ refresh } = {}) => {
      const limit =
        params && params.get("limit")
          ? parseInt(params.get("limit"))
          : DEFAULT_LIMIT

      setLoading(true)
      const real_query = {
        groups: _query.groups || [],
        ...query,
        order: viewType,
        skip: lastView === viewType && !refresh ? posts.length : 0,
        limit: refresh && posts.length > 0 ? posts.length : limit,
        size: "small"
      }
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
      // console.log(real_query)
      apiPost.query(real_query).then(res => {
        if (lastView !== viewType || refresh) {
          setPosts(res.data.docs)
          setLastView(viewType)
        } else {
          setPosts([...posts, ...res.data.docs])
        }
        setLoading(false)
      })
    },
    [params, query, posts, lastView, viewType]
  )

  // perform the query
  useEffect(() => {
    performQuery({ refresh: true })
  }, [params, query, group, _query])

  useEffect(() => {
    if (viewType !== lastView) {
      performQuery({ refresh: true })
    }
  }, [viewType, lastView])

  useEffect(() => {
    if (viewMore) performQuery()
  }, [viewMore])

  // update query because of remote change
  useListen("post/create", () => {
    if (viewType !== "hot") {
      console.log("hey")
      performQuery({ refresh: true })
    }
  })
  useListen("post/delete", id => {
    if (viewingPost === id) setViewingPost()
    setDeleted({
      ...deleted,
      [id]: true
    })
  })

  useEffect(() => {
    if (params && params.get("group")) {
      const name = params.get("group")
      setGroup(name)
    } else {
      setGroup()
    }
    if (params && params.get("limit") && posts.length < params.get("limit")) {
      performQuery({ refresh: true })
    }
  }, [params])

  const [node, setNode] = useState()

  useEffect(() => {
    if (node && posts) {
      setTimeout(() => node.updateLayout(), 1000)
    }
  }, [node, posts])

  useEffect(() => {
    if (ls_postview.view_type) setViewType(ls_postview.view_type)
  }, [ls_postview])

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
      <ThemeProvider theme={theme}>
        <div className={bss("header")}>
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
            onOpen={() => setSearching(true)}
            onClose={() => setSearching(false)}
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
          {!searching && (
            <div className={bss("views")}>
              <Button
                label="Hot"
                icon="FlashOn"
                outlined={viewType === "hot"}
                onClick={() => ls_set_postview("view_type", "hot")}
              />
              <Button
                label="New"
                icon="ArrowDownward"
                outlined={viewType === "new"}
                onClick={() => ls_set_postview("view_type", "new")}
              />
              <Button
                label="Old"
                icon="ArrowUpward"
                outlined={viewType === "old"}
                onClick={() => ls_set_postview("view_type", "old")}
              />
              {viewType === "hot" && (
                <Button
                  icon="Autorenew"
                  onClick={() => performQuery({ refresh: true })}
                />
              )}
            </div>
          )}
        </div>
        {(!username || (user && username === user.username) || userData) && (
          <PostInput defaultValue={userData ? { mention: [userData] } : null} />
        )}
      </ThemeProvider>
      <div className={bss("posts")}>
        {posts && posts.length > 0 && (
          <StackGrid
            itemComponent="div"
            gridRef={node => setNode(node)} //ref_grid}
            columnWidth={300}
            monitorImagesLoaded={true}
          >
            {posts
              ? posts
                  .filter(p => !deleted[p._id])
                  .map(p => (
                    <Post
                      id={p._id}
                      key={p._id}
                      data={p}
                      size="small"
                      onClick={() => setViewingPost(p)}
                      truncate
                    />
                  ))
              : "loading..."}
          </StackGrid>
        )}
        {posts && posts.length === 0 && "No posts yet..."}
        {viewingPost != null && (
          <ThemeProvider username={viewingPost.user.username}>
            <PostViewModal
              open={viewingPost != null}
              onClose={() => setViewingPost()}
              onDeletePost={() => setViewingPost()}
              id={viewingPost._id}
            />
          </ThemeProvider>
        )}
        {posts && posts.length > 0 && !viewMore && (
          <ThemeProvider theme={theme}>
            <Button
              className={css({
                alignSelf: "center",
                marginBottom: 30
              })}
              size="large"
              icon={loading ? "MoreHoriz" : null}
              label={loading ? null : "Load more posts"}
              onClick={() => {
                performQuery()
                /*setViewMore(true)*/
              }}
              outlined
              disabled={loading}
            />
          </ThemeProvider>
        )}
      </div>
    </div>
  )
}

export default PostView
