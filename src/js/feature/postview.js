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
import Grid from "component/grid"
import { useListen } from "util"
import * as apiPost from "api/post"
import * as apiUser from "api/user"
import * as apiFollow from "api/follow"
import * as suggest from "feature/suggestion"
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

const PostView = ({ theme, className }) => {
  const [ls_postview, ls_set_postview] = useSettingsContext("postview")
  const [ls_postviewui] = useSettingsContext("postview_ui")
  const [query, setQuery] = useState({})
  const [posts, setPosts] = useState([])
  // prevents showing posts before query parameters are loaded
  const [loadCount, setLoadCount] = useState(0)
  const [viewingPost, setViewingPost] = useState()
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
  const [noMorePosts, setNoMorePosts] = useState()

  const { params } = useQuery()
  const [group, setGroup] = useState()

  const [following, updateFollowing, fetch] = apiFollow.useFollowUser(username)

  useEffect(() => {
    if (username) {
      apiUser.get(username).then(res => {
        if (res.data.users.length > 0) setUserData(res.data.users[0])
      })
      fetch()
    }
  }, [username])

  // change title when query changes
  useEffect(() => {
    let new_title = []
    if (query.usernames && query.usernames.length > 0) {
      new_title.concat(query.usernames.map(u => `@${u.label}`))
    }
    setSubtitle(new_title.join(","))
  }, [query])

  // reset uses default post limit
  // refresh uses current # of posts as limit and last query
  const performQuery = useCallback(
    ({ reset, refresh, cancel } = {}) => {
      setLoading(true)
      const real_query = {
        groups: [],
        usernames: [],
        order: viewType,
        skip: refresh || reset ? 0 : posts.length,
        size: "small",
        following: true,
        ...query,
        limit:
          refresh && !reset
            ? posts.length
            : query.limit != null
            ? query.limit
            : DEFAULT_LIMIT
      }

      return apiPost.query(real_query, { cancel }).then(res => {
        setNoMorePosts(res.data.end)
        if (reset || refresh) {
          setPosts(res.data.docs.map(p => p._id))
          setLastView(viewType)
        } else {
          setPosts((posts || []).concat(res.data.docs.map(p => p._id)))
          window.scrollTo(0, document.body.scrollHeight)
        }
        setLoading(false)
      })
    },
    [params, query, posts, viewType]
  )

  // update query because of remote change
  useListen("post/create", () => {
    if (viewType !== "hot") {
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

  // url param change
  useEffect(() => {
    const new_query = {}
    if (!searching) {
      if (params && params.get("group")) {
        new_query.groups = [params.get("group")]
        setGroup(params.get("group"))
      } else {
        setGroup()
      }
      if (params && params.get("limit")) new_query.limit = params.get("limit")
      if (username) {
        new_query.usernames = [username]
      }

      setQuery(new_query)
    }
  }, [params, username, searching])

  // perform query when params change constraints
  useEffect(() => {
    let cancel
    performQuery({ reset: true, cancel: c => (cancel = c) })
    return () => {
      if (cancel) cancel()
    }
  }, [query])

  // view type
  useEffect(() => {
    let cancel
    if (viewType !== lastView) {
      performQuery({ refresh: true, cancel: c => (cancel = c) })
    }
    return () => {
      if (cancel) cancel()
    }
  }, [viewType, lastView])

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
              {userData ? userData.display_name : "All"}
            </Text>
          )}
          {username && user && user.username !== username && (
            <Button
              label={following ? "Unfollow" : "Follow"}
              onClick={updateFollowing}
            />
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
                following: false,
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
              {
                /*viewType === "hot" &&*/ <Button
                  icon="Autorenew"
                  onClick={() => performQuery({ refresh: true })}
                />
              }
            </div>
          )}
        </div>
        {(!username || (user && username === user.username) || userData) && (
          <PostInput
            defaultValue={{
              mention: userData && [userData],
              group: group && [{ name: group }]
            }}
          />
        )}
      </ThemeProvider>
      <div className={bss("posts")}>
        <Grid width={300}>
          {posts && posts.length > 0
            ? posts
                .filter(p => !deleted[p])
                .map(p => (
                  <Post
                    id={p}
                    key={p}
                    size="small"
                    onClick={() => setViewingPost(p)}
                    truncate
                  />
                ))
            : posts
            ? "No posts yet..."
            : "loading..."}
        </Grid>
        {viewingPost != null && (
          <PostViewModal
            open={viewingPost != null}
            onClose={() => setViewingPost()}
            onDeletePost={() => setViewingPost()}
            id={viewingPost}
          />
        )}
        {posts && posts.length > 0 && !viewMore && !noMorePosts && (
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
