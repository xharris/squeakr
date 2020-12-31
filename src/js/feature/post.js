import React, { useState, useEffect, forwardRef, useCallback } from "react"
import { useLocation, useHistory } from "react-router-dom"

import Card from "component/card"
import Icon from "component/icon"
import Markdown from "component/markdown"
import PostViewModel from "feature/postviewmodal"
import Tag from "feature/tag"
import Avatar from "feature/avatar"
import Button from "component/button"
import MenuButton from "component/menubutton"
import Body from "feature/body"
import Text from "component/text"
import ThemeProvider, { ThemeContext, useThemeContext } from "feature/theme"
import { useAuthContext } from "component/auth"
import PostEditModal from "feature/posteditmodal"
import ConfirmDialog from "component/modal/confirm"
import PostInput from "feature/postinput"
import CommentInput from "feature/commentinput"
import Comment from "feature/comment"
import Box from "component/box"
import { useListen } from "util"
import * as apiPost from "api/post"
import * as url from "util/url"
import * as apiReaction from "api/reaction"
import { block, cx, css, lightenDarken, pickFontColor, hex2rgb } from "style"

const bss = block("post")

const re_youtube = /youtu(?:\.be\/(.+)|be\.com.+(?:v=|embed\/)(.+)\?+?)/i

const Post = forwardRef(
  (
    { id, size, preview, viewing, truncate, onClick, className, onDelete },
    ref
  ) => {
    const { theme, setTheme, getColor } = useThemeContext()
    const { user } = useAuthContext()
    const [data, setData] = useState()
    const [dateCreated, setDateCreated] = useState()
    const [dateCreatedLong, setDateCreatedLong] = useState()
    const [viewPost, setViewPost] = useState(viewing)
    const [videos, setVideos] = useState([])
    const [type, setType] = useState("text")
    const [editing, setEditing] = useState()
    const [showSpoiler, setShowSpoiler] = useState(false)
    const [showDelete, setShowDelete] = useState()
    const [reactions, setReactions] = useState()

    const query = new URLSearchParams(useLocation().search)
    const history = useHistory()

    const formatDate = (d, with_time) =>
      new Date(d).toLocaleString(navigator.language, {
        dateStyle: "short",
        timeStyle: with_time && "short",
        hour12: true
      })

    const fetchPost = _id => apiPost.get(_id || id).then(setData)

    const fetchReactions = useCallback(
      _id => {
        if (_id || (data && data._id))
          apiReaction.post(_id || data._id).then(res => setReactions(res.docs))
      },
      [data]
    )

    useListen("post/update", id, () => fetchPost(id))
    useListen("comment/add-post", id, () => fetchPost(id))
    useListen("reaction/post-add", id, () => fetchReactions(id))
    useListen("reaction/post-delete", id, () => fetchReactions(id))

    useEffect(() => {
      if (preview) {
        setData({
          ...preview,
          user
        })
      } else if (id) {
        fetchPost(id)
        fetchReactions(id)
      }
    }, [id, preview])

    useEffect(() => {
      // check if user is viewing the enlarged version of a small post
      if (data && query && size !== "full") {
        if (query.get("post") === data._id) setViewPost(true)
      }
    }, [data, query, size])

    useEffect(() => {
      if (data) {
        setTheme(data.user.theme)
        setDateCreated(formatDate(data.date_created))
        setDateCreatedLong(formatDate(data.date_created, true))
      }
    }, [data])

    useEffect(() => {
      setType(videos.length > 0 ? videos[0].source : "text")
    }, [videos])

    // view count
    useEffect(() => {
      const timer = setTimeout(() => {
        if (id && !editing && size === "full") apiPost.view(id)
      }, 15000)
      return () => {
        clearTimeout(timer)
      }
    }, [id, size, editing])

    return data ? (
      <div className={cx(bss({ size, type }), className)} ref={ref}>
        <ThemeProvider theme={data.user.theme}>
          <ThemeContext.Consumer>
            {({ theme }) => (
              <Card
                className={bss("card")}
                color={lightenDarken(theme.secondary, -50)}
                bgColor={theme.secondary}
                thickness={size === "small" ? 2 : 6}
                onClick={() => !preview && onClick && onClick()}
                to={
                  size === "small" && !preview && !onClick && url.post(data._id)
                }
                title={
                  size === "small"
                    ? `${data.user.display_name} - ${dateCreatedLong}`
                    : ""
                }
              >
                {editing ? (
                  <div className={bss("main")}>
                    <PostInput defaultValue={data} onCancel={setEditing} />
                  </div>
                ) : (
                  <div className={bss("main")}>
                    {data.comment.length > 0 && size === "small" && (
                      <Icon
                        icon="Comment"
                        className={cx(
                          bss("icon_comment"),
                          css({
                            color: getColor(data.user.theme.primary)
                          })
                        )}
                      />
                    )}
                    <Avatar
                      user={data.user}
                      preview={preview}
                      size={size === "full" ? "medium" : "small"}
                      nolink={size === "small"}
                    />
                    <Body
                      div={true /* size === "small"*/}
                      className={bss("content", {
                        blur: data.spoiler && !showSpoiler
                      })}
                      fixed
                    >
                      {videos.length > 0 && size === "small" && (
                        <div
                          className={cx(
                            bss("thumbnail"),
                            css({
                              background: `url(${videos[0].thumbnail})`
                            })
                          )}
                        />
                      )}
                      {data.spoiler && !showSpoiler && (
                        <div
                          className={cx(
                            bss("spoiler"),
                            css({
                              background:
                                data.spoiler &&
                                !showSpoiler &&
                                `rgba(${hex2rgb(theme.secondary, 0.8).join(
                                  ","
                                )})`
                            })
                          )}
                          onClick={() => setShowSpoiler(true)}
                        >
                          SPOILER
                          <span>
                            click to {size === "small" ? "view" : "reveal"}
                          </span>
                        </div>
                      )}
                      {(type === "text" || size === "full") && (
                        <Markdown
                          content={
                            truncate && data.content.length > 300
                              ? data.content.slice(0, 300) + "..."
                              : data.content
                          }
                          size={size}
                          preview={preview || size === "small"}
                        />
                      )}
                      {truncate &&
                        size === "full" &&
                        data.content.length > 300 && (
                          <Button
                            className={bss("readmore")}
                            bg="primary"
                            to={url.post(data._id)}
                            label="Read more >>"
                            type="link"
                          />
                        )}
                      {data.mention.length > 0 && (
                        <div className={bss("mentions")}>
                          {data.mention.map(m =>
                            size === "small" ? (
                              <Text
                                key={m._id}
                                className={bss("mention")}
                                amt={60}
                                themed
                              >{`@${m.display_name}`}</Text>
                            ) : (
                              <Button
                                key={m._id}
                                icon="AlternateEmail"
                                amt={40}
                                label={m.display_name}
                                to={url.user(m._id)}
                              />
                            )
                          )}
                        </div>
                      )}
                      {data.group.length > 0 && (
                        <div className={bss("mentions")}>
                          {data.group.map(g =>
                            size === "small" ? (
                              <Text
                                key={g._id}
                                className={bss("mention")}
                                amt={60}
                                themed
                              >{`#${g.name}`}</Text>
                            ) : (
                              <Button
                                key={g._id}
                                amt={40}
                                label={`#${g.name}`}
                                to={url.explore({ group: g.name })}
                              />
                            )
                          )}
                        </div>
                      )}
                    </Body>
                    {type === "youtube" && size === "small" && (
                      <Icon
                        className={cx(bss("icon"), css({ color: "#FF0000" }))}
                        icon="YouTube"
                      />
                    )}
                  </div>
                )}
                {size !== "small" && (
                  <div className={bss("footer")}>
                    <Text
                      className={bss("date")}
                      title={`${data.user.display_name} - ${dateCreatedLong}`}
                      color="secondary"
                      bg="primary"
                      amt={30}
                      themed
                    >
                      {dateCreated}
                    </Text>
                    <div className={css({ display: "flex" })}>
                      {!preview && (
                        <Button
                          icon="OpenInNew"
                          title={url.post(data._id)}
                          to={url.post(data._id)}
                          type="button"
                          onClick={() => {}}
                        />
                      )}
                      {!preview && user && user._id === data.user._id && (
                        <MenuButton
                          key="actions"
                          icon="Settings"
                          items={[
                            {
                              label: "Edit",
                              onClick: () => setEditing(true)
                            },
                            {
                              label: "Delete",
                              onClick: () => setShowDelete(true)
                            }
                          ]}
                          closeOnSelect
                        />
                      )}
                    </div>
                    <ConfirmDialog
                      open={showDelete}
                      prompt="Are you sure you want to delete this post?"
                      onYes={() => apiPost.del(id).then(() => onDelete())}
                      onClose={setShowDelete}
                    />
                  </div>
                )}
              </Card>
            )}
          </ThemeContext.Consumer>
          {size !== "small" && (
            <Box className={bss("after_post")}>
              <div className={bss("reactions")}>
                <Button
                  icon="ThumbUpAlt"
                  label={
                    reactions
                      ? reactions.filter(r => r.icon === "ThumbUpAlt").length
                      : 0
                  }
                  onClick={() => apiReaction.post(data._id, "ThumbUpAlt")}
                />
                {/*reactions &&
              {
                /*<Button
              icon="Add"
              onClick={() => showEmojiBoard(true)}
            />*/}
              </div>
              <CommentInput postid={data._id} />
              {data.comment.length > 0 && (
                <div className={bss("comments")}>
                  {data.comment.map(c => (
                    <Comment key={c._id} id={c._id} data={c.data} showReplies />
                  ))}
                </div>
              )}
            </Box>
          )}
        </ThemeProvider>
      </div>
    ) : (
      <Card
        className={bss({ size, empty: true })}
        color={lightenDarken(theme.secondary, -70)}
        bgColor={theme.secondary}
        thickness={size === "small" ? 2 : 5}
      />
    )
  }
)

export default Post
