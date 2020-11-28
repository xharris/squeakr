import React, { useState, useEffect, useRef } from "react"
import { useLocation, useHistory } from "react-router-dom"

import Card from "component/card"
import Icon from "component/icon"
import Markdown, { getVideos } from "component/markdown"
import PostViewModel from "feature/postviewmodal"
import Tag from "feature/tag"
import Avatar from "feature/avatar"
import Button from "component/button"
import Body from "feature/body"
import { useThemeContext } from "feature/theme"
import { useAuthContext } from "component/auth"
import * as apiPost from "api/post"
import * as url from "util/url"
import { block, cx, css, lightenDarken, pickFontColor } from "style"

const bss = block("post")

const re_youtube = /youtu(?:\.be\/(.+)|be\.com.+(?:v=|embed\/)(.+)\?+?)/i

const Post = ({ id, data: _data, size, preview, viewing }) => {
  const { theme, setTheme } = useThemeContext()
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [dateCreated, setDateCreated] = useState()
  const [viewPost, setViewPost] = useState(viewing)
  const [videos, setVideos] = useState([])
  const [type, setType] = useState("text")

  const query = new URLSearchParams(useLocation().search)
  const history = useHistory()

  const formatDate = d =>
    new Date(d).toLocaleString(navigator.language, {
      dateStyle: "short",
      timeStyle: "short",
      hour12: true
    })

  useEffect(() => {
    if (!_data && id) {
      apiPost.get(id).then(setData)
    } else if (preview) {
      apiPost.preview(preview).then(setData)
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
          size={size}
          nolink={size === "small"}
        />
      </div>
      {data.tags && (
        <div className={bss("tags")}>
          {data.tags.map(t => (
            <Tag
              value={preview ? t : t.value}
              request={t.request}
              key={preview ? t : t.value}
              className={bss("tag")}
              size={size}
              username={data.user.username}
              nolink={size === "small"}
            />
          ))}
          {size === "full" && (
            <Button
              icon="OpenInNew"
              to={url.tag({
                username: data.user.username,
                tags: data.tags.map(t => t.value)
              })}
              link
              target="_blank"
            />
          )}
        </div>
      )}
      {size === "full" && (
        <div
          className={cx(
            bss("date"),
            css({
              color: pickFontColor(
                theme.primary,
                type === "text" ? theme.secondary : theme.primary
              )
            })
          )}
        >
          {dateCreated}
        </div>
      )}
    </div>
  )

  return data ? (
    <>
      <Card
        className={bss({ size, type })}
        color={lightenDarken(theme.secondary, -70)}
        bgColor={theme.secondary}
        thickness={size == "small" ? 2 : 5}
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
            bss("content"),
            videos.length > 0 &&
              size === "small" &&
              css({
                background: `url(${videos[0].thumbnail})`
              })
          )}
          fixed
        >
          {(type === "text" || size === "full") && (
            <Markdown content={data.content} size={size} />
          )}
        </Body>
        {type === "youtube" && size === "small" && (
          <Icon
            className={cx(bss("icon"), css({ color: "#FF0000" }))}
            icon="YouTube"
          />
        )}
        {(type === "text" || size === "small") && <Footer />}
      </Card>
      {type !== "text" && size === "full" && (
        <Footer
          className={css({
            marginBottom: 20
          })}
        />
      )}
      {size === "full" && (
        <div className={bss("below_post")}>
          {!preview && (
            <div className={bss("reactions")}>
              <Button
                className={bss("reaction")}
                label="👍"
                onClick={() => {}}
                color={theme.secondary}
                disabled={!user || user._id === data.user._id}
                outlined
              />
            </div>
          )}
        </div>
      )}
    </>
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
