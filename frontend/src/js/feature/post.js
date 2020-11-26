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
import { block, cx, css, lightenDarken } from "style"

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
        {type === "youtube" && (
          <Icon
            className={cx(bss("icon"), css({ color: "#FF0000" }))}
            icon="YouTube"
          />
        )}
        {size === "small" && <div className={bss("date")}>{dateCreated}</div>}
        <div className={bss("tags")}>
          {size === "small" &&
            data.tags &&
            data.tags.map(t => (
              <Tag
                value={t.value}
                request={t.request}
                key={t.value}
                className={bss("tag")}
              />
            ))}
        </div>
      </Card>
      {size === "full" && (
        <div className={bss("tags")}>
          {data.tags.map(t => (
            <Tag
              value={t.value}
              request={t.request}
              key={t.value}
              className={bss("tag")}
              color="secondary"
            />
          ))}
        </div>
      )}
      {size === "full" && (
        <div className={bss("author_container")}>
          <div className={bss("author")}>
            <Avatar user={data.user} theme={theme} preview={preview} />
          </div>
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
