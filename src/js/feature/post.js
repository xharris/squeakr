import React, { useState, useEffect, useRef } from "react"
import { useLocation, useHistory } from "react-router-dom"

import Card from "component/card"
import Icon from "component/icon"
import Markdown, { getVideos } from "component/markdown"
import PostViewModel from "feature/postviewmodal"
import Tag from "feature/tag"
import Avatar from "feature/avatar"
import Button from "component/button"
import MenuButton from "component/menubutton"
import Body from "feature/body"
import Text from "component/text"
import { useThemeContext } from "feature/theme"
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

const Post = ({
  id,
  data: _data,
  size,
  preview,
  viewing,
  truncate,
  onClick
}) => {
  const { theme, setTheme, getColor } = useThemeContext()
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [dateCreated, setDateCreated] = useState()
  const [dateCreatedLong, setDateCreatedLong] = useState()
  const [viewPost, setViewPost] = useState(viewing)
  const [videos, setVideos] = useState([])
  const [type, setType] = useState("text")
  const [editing, setEditing] = useState()
  const [showSpoiler, setShowSpoiler] = useState(false)
  const [showDelete, setShowDelete] = useState()

  const query = new URLSearchParams(useLocation().search)
  const history = useHistory()

  const formatDate = (d, with_time) =>
    new Date(d).toLocaleString(navigator.language, {
      dateStyle: "short",
      timeStyle: with_time && "short",
      hour12: true
    })

  useListen("post/update", id, () => {
    apiPost.get(id).then(setData)
  })
  useListen("comment/add-post", id, () => {
    apiPost.get(id).then(setData)
  })

  useEffect(() => {
    if (!_data && id) {
      apiPost.get(id).then(setData)
    } else if (preview) {
      setData({
        ...preview,
        user
      })
    }
  }, [id, _data, preview])

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
      setVideos(getVideos(data.content))
    }
  }, [data])

  useEffect(() => {
    setType(videos.length > 0 ? videos[0].source : "text")
  }, [videos])

  return data ? (
    <div className={bss({ size, type })}>
      <Card
        className={bss("card")}
        color={lightenDarken(theme.secondary, -50)}
        bgColor={theme.secondary}
        thickness={size === "small" ? 2 : 6}
        onClick={() => !preview && onClick && onClick()}
        to={size === "small" && !preview && !onClick && url.post(data._id)}
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
              className={cx(
                bss("content", { blur: data.spoiler && !showSpoiler }),
                videos.length > 0 &&
                  size === "small" &&
                  css({
                    background: `url(${videos[0].thumbnail})`
                  })
              )}
              fixed
            >
              {data.spoiler && !showSpoiler && (
                <div
                  className={cx(
                    bss("spoiler"),
                    css({
                      background:
                        data.spoiler &&
                        !showSpoiler &&
                        `rgba(${hex2rgb(theme.secondary, 0.8).join(",")})`
                    })
                  )}
                  onClick={() => setShowSpoiler(true)}
                >
                  SPOILER
                  <span>click to {size === "small" ? "view" : "reveal"}</span>
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
              {truncate && size === "full" && data.content.length > 300 && (
                <Button
                  className={bss("readmore")}
                  bg="primary"
                  to={url.post(data._id)}
                  label="Read more >>"
                  type="link"
                />
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
                <Button icon="Share" title="Share" onClick={() => {}} />
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
              onYes={() => apiPost.del(id)}
              onClose={setShowDelete}
            />
          </div>
        )}
      </Card>
      {size !== "small" && (
        <div className={bss("after_post")}>
          <div className={bss("reactions")}>
            <Button
              icon="ThumbUpAlt"
              onClick={() => apiReaction.post(data._id, "ThumbUpAlt")}
            />
          </div>
          <CommentInput postid={data._id} />
          {data.comment.length > 0 && (
            <Box className={bss("comments")}>
              {data.comment.map(c => (
                <Comment key={c} id={c} showReplies />
              ))}
            </Box>
          )}
        </div>
      )}
    </div>
  ) : (
    <Card
      className={bss({ size, empty: true })}
      color={lightenDarken(theme.secondary, -70)}
      bgColor={theme.secondary}
      thickness={size === "small" ? 2 : 5}
    >
      No data
    </Card>
  )
}

export default Post
