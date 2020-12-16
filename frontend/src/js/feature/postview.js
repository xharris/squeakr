import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "util"
import { useAuthContext } from "component/auth"
import * as apiFollow from "api/follow"
import Post from "feature/post"
import Button from "component/button"
import Text from "component/text"
import TagInput from "feature/taginput"
import ThemeProvider, { useThemeContext } from "feature/theme"
import { useSettingsContext } from "component/settings"
import { Checkbox } from "component/form"
import * as apiPost from "api/post"
import { cx, block, css, pickFontColor } from "style"

const bss = block("postview")

const Separator = () => {
  const { theme } = useThemeContext()
  return (
    <span
      className={cx(
        bss("separator"),
        css({
          borderRight: `1px solid ${pickFontColor(
            theme.primary,
            theme.primary,
            10
          )}`
        })
      )}
    />
  )
}

/* query
{
  usernames: [], // list of usernames
  user_ids: [],
  tags: [], // empty for all tags
  sort: '', // newest, oldest, controversial, popular
  limit: 0
}
*/

const PostView = ({ query: _query, theme, className, nolimit }) => {
  const [ls_postview, ls_set_postview] = useSettingsContext("postview")
  const [ls_postviewui, ls_set_postviewui] = useSettingsContext("postview_ui")
  const [query, setQuery] = useState({ ..._query })
  const [posts, setPosts] = useState()
  const [size, setSize] = useState(ls_postview.size)
  const [searching, setSearching] = useState()
  const [searchTags, setSearchTags] = useState()
  const [showControls, setShowControls] = useState()
  const { user } = useAuthContext()
  const { params, setParam } = useQuery()
  const [following, follow, checkFollowing] = apiFollow.useFollowTags(
    searchTags || []
  )

  // on view settings change
  useEffect(() => {
    setQuery({
      ...query,
      ...ls_postview
    })
    setShowControls(ls_postviewui.showcontrols)
  }, [ls_postview, ls_postviewui])

  useEffect(() => {
    if (size != null) ls_set_postview("size", size)
  }, [size])

  useEffect(() => {
    apiPost.query(query).then(res => {
      setPosts(res.data.docs)
    })
  }, [query])

  useEffect(() => {
    if (params && params.get("tags"))
      setSearchTags(params.get("tags").split(","))
    else setSearchTags()
  }, [params])

  useEffect(() => {
    if (searchTags) {
      setQuery({ ...query, tags: searchTags })
      checkFollowing(searchTags)
      setParam("tags", searchTags.join(","))
    } else {
      setQuery({ ...query, tags: null })
      setParam("tags")
    }
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
            {searchTags ? `# ${searchTags.join(" ")}` : "Latest posts"}
          </Text>
          {user && searchTags && searchTags.length > 0 && (
            <Button
              icon={following ? "Remove" : "Add"}
              title={following ? "Unfollow" : "Follow"}
              onClick={() => follow(searchTags)}
              color="primary"
            />
          )}
          <Button
            icon={showControls ? "ExpandLess" : "ExpandMore"}
            title={showControls ? "Hide controls" : "Show controls"}
            onClick={() =>
              ls_set_postviewui("showcontrols", !ls_postviewui.showcontrols)
            }
            color="primary"
          />
        </ThemeProvider>
      </div>
      <div className={bss("controls", { hide: !ls_postviewui.showcontrols })}>
        <div className={bss("sizes")}>
          <Button
            icon="ViewDay"
            title="Full"
            outlined={size === "full"}
            onClick={() => setSize("full")}
          />
          <Button
            icon="ViewModule"
            title="Grid"
            outlined={size === "small"}
            onClick={() => setSize("small")}
          />
        </div>
        <Separator />
        {!(query.usernames || query.user_ids) && (
          <Checkbox
            bg={theme && theme.primary}
            defaultValue={ls_postview.following}
            onChange={e => ls_set_postview("following", e)}
            label="Following"
          />
        )}
        <Checkbox
          bg={theme && theme.primary}
          defaultValue={ls_postview.tag_exact}
          onChange={e => ls_set_postview("tag_exact", e)}
          label="Exact tags"
        />
        <Separator />
        {searching ? (
          <TagInput
            defaultValue={searchTags && searchTags.map(value => ({ value }))}
            onChange={v => setSearchTags(v.map(t => t.value))}
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
            className={css({
              marginLeft: 3
            })}
            onClick={() => {
              setSearching(false)
              if (!searchTags || searchTags.length === 0) setSearchTags()
            }}
          />
        )}
      </div>
      <div className={bss("posts")}>
        {posts
          ? posts.map(p => (
              <ThemeProvider key={p._id} theme={p.user.theme}>
                <Post data={p} key={p._id} size={size} truncate />
              </ThemeProvider>
            ))
          : "loading..."}
        {posts && posts.length === 0 && "No posts yet..."}
      </div>
    </div>
  )
}

export default PostView
