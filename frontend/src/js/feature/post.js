import React, { useState, useEffect, useRef } from "react"
import { useLocation, useHistory } from "react-router-dom"

import Card from "component/card"
import Icon from "component/icon"
import Markdown from "component/markdown"
import PostViewModel from "feature/postviewmodal"
import Avatar from "feature/avatar"
import Button from "component/button"
import Body from "feature/body"
import { useAuthContext } from "component/auth"
import * as apiPost from "api/post"
import * as url from "util/url"
import { block, cx, css, lightenDarken } from "style"

const bss = block("post")

const re_youtube = /youtu(?:\.be\/(.+)|be\.com.+(?:v=|embed\/)(.+)\?+?)/i

const Post = ({ id, data: _data, theme, size, viewing }) => {
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [dateCreated, setDateCreated] = useState()
  const [youtubeInfo, setYoutubeInfo] = useState()
  const [viewPost, setViewPost] = useState(viewing)
  const [text, setText] = useState()

  const query = new URLSearchParams(useLocation().search)
  const history = useHistory()
  const el_markdown = useRef()

  useEffect(() => {
    if (!_data && id) {
      apiPost.get(id).then(setData)
    }
  }, [])

  useEffect(() => {
    // check if user is viewing the enlarged version of a small post
    if (data && query && size !== "full") {
      if (query.get("post") === data._id) setViewPost(true)
    }
  }, [data, query, size])

  useEffect(() => {
    if (!theme) theme = data.user.theme
    setDateCreated(
      new Date(data.date_created).toLocaleString(navigator.language, {
        dateStyle: "short",
        timeStyle: "short",
        hour12: true
      })
    )
    // video: get youtube info
    if (data.type === "video") {
      const match = data.content.match(re_youtube)
      setYoutubeInfo({
        id: match[1] || match[2]
      })
    }
    if (data.type === "text") {
      setText()
    }
  }, [data])

  useEffect(() => {
    if (el_markdown.current && text) {
      el_markdown.current.innerHTML = text
    }
  }, [el_markdown, text])

  return (
    data && (
      <>
        <Card
          className={bss({ size, type: data.type })}
          color={lightenDarken(theme.secondary, -70) /*"#616161"*/}
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
          to={size === "small" && url.post(data._id)}
        >
          <div className={bss("header")}></div>
          <Body
            div={true /* size === "small"*/}
            className={cx(
              bss("content"),
              youtubeInfo &&
                size === "small" &&
                css({
                  background: `url(http://i3.ytimg.com/vi/${youtubeInfo.id}/hqdefault.jpg)`
                })
            )}
            fixed
          >
            {data.type === "text" && (
              <Markdown content={data.content} theme={theme} size={size} />
            )}

            {data.type === "video" && size === "full" && youtubeInfo && (
              <iframe
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${youtubeInfo.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </Body>
          {youtubeInfo && (
            <Icon
              className={cx(bss("icon"), css({ color: "#FF0000" }))}
              icon="YouTube"
            />
          )}
          {size === "small" && <div className={bss("date")}>{dateCreated}</div>}
        </Card>
        {size === "small" && (
          <PostViewModel
            data={data}
            theme={theme}
            open={viewPost}
            onClose={() => {
              setViewPost()

              if (size === "small") {
                query.delete("post")
                const loc = history.location
                loc.search = query.toString()
                history.push(loc)
              }
            }}
          />
        )}
        {size === "full" && (
          <div className={bss("author_container")}>
            <div className={bss("author")}>
              <Avatar user={data.user} />
            </div>
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
          </div>
        )}
      </>
    )
  )
}

export default Post
