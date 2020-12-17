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
import { useThemeContext } from "feature/theme"
import { useAuthContext } from "component/auth"
import PostEditModal from "feature/posteditmodal"
import * as apiPost from "api/post"
import * as url from "util/url"
import { block, cx, css, lightenDarken, pickFontColor, hex2rgb } from "style"

const bss = block("post")

const re_youtube = /youtu(?:\.be\/(.+)|be\.com.+(?:v=|embed\/)(.+)\?+?)/i

const Post = ({ id, data: _data, size, preview, viewing, truncate }) => {
  const { theme, setTheme } = useThemeContext()
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [dateCreated, setDateCreated] = useState()
  const [viewPost, setViewPost] = useState(viewing)
  const [videos, setVideos] = useState([])
  const [type, setType] = useState("text")
  const [postModal, setPostModal] = useState()
  const [showSpoiler, setShowSpoiler] = useState(false)

  const query = new URLSearchParams(useLocation().search)
  const history = useHistory()

  const formatDate = (d, with_time) =>
    new Date(d).toLocaleString(navigator.language, {
      dateStyle: "short",
      timeStyle: with_time && "short",
      hour12: true
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
      setVideos(getVideos(data.content))
    }
  }, [data])

  useEffect(() => {
    setType(videos.length > 0 ? videos[0].source : "text")
  }, [videos])

  const Footer = ({ className }) => (
    <div className={cx(bss("footer"), className)}>
      <div className={bss("author")}>
        <Avatar
          user={data.user}
          theme={theme}
          preview={preview}
          size={size === "full" ? "medium" : "small"}
          nolink={size === "small"}
        />
      </div>
      {data.tags && data.tags.length > 0 && (
        <div className={bss("tags")}>
          {data.tags.map(tag => (
            <Tag
              value={tag.value}
              request={tag.request}
              key={tag.value}
              className={bss("tag")}
              size={size}
              username={data.user.username}
              nolink={size === "small" || preview}
            />
          ))}
          {size === "full" && !preview && (
            <Button
              icon="OpenInNew"
              to={url.tag({
                username: data.user.username,
                tags: data.tags.map(t => t.value)
              })}
              link
            />
          )}
        </div>
      )}
      {size === "full" && [
        <div
          key="date"
          className={cx(
            bss("date"),
            css({
              color: pickFontColor(theme.secondary, theme.primary)
            })
          )}
        >
          {dateCreated}
        </div>,
        <div key="footer_actions" className={css({ display: "flex" })}>
          {!preview && <Button icon="Share" title="Share" onClick={() => {}} />}
          {!preview && user && user._id === data.user._id && (
            <MenuButton
              key="actions"
              icon="Settings"
              items={[
                {
                  label: "Edit",
                  onClick: () => setPostModal(true)
                },
                {
                  label: "Delete"
                }
              ]}
              closeOnSelect
            />
          )}
        </div>,
        !preview && (
          <PostEditModal
            key="edit_modal"
            data={data}
            open={postModal}
            onClose={setPostModal}
          />
        )
      ]}
    </div>
  )

  return data ? (
    <Card
      className={bss({ size, type })}
      color={lightenDarken(theme.secondary, -50)}
      bgColor={theme.secondary}
      thickness={size == "small" ? 2 : 6}
      onClick={() => {
        /*
            if (size === "small") {
              query.set("post", data._id)
              const loc = history.location
              loc.search = query.toString()
              history.push(loc)
            }*/
      }}
      to={size === "small" && !preview && url.post(data._id)}
    >
      <div className={bss("header")}></div>
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
      <Footer />
    </Card>
  ) : (
    <Card
      className={bss({ size, empty: true })}
      color={lightenDarken(theme.secondary, -70)}
      bgColor={theme.secondary}
      thickness={size == "small" ? 2 : 5}
    >
      No data
    </Card>
  )
}

export default Post
