import React, { useEffect, useState, useRef } from "react"
import DOMPurify from "dompurify"
import marked from "marked"

import { block, cx, css, lightenDarken, hex2rgb } from "style"

const bss = block("markdown")

const re_newline = /(?:\r\n|\r|\n)/g
const re_youtube = /youtu(?:\.be\/(\S+)|be\.com.+(?:v=(\S+)|embed\/(\S+)\?))/gi

export const getVideos = content => {
  const videos = []
  var match
  do {
    // youtube
    match = re_youtube.exec(content)
    if (match) {
      const id = match[1] || match[2] || match[3]
      videos.push({
        source: "youtube",
        thumbnail: `http://i3.ytimg.com/vi/${id}/hqdefault.jpg`,
        iframe: `<iframe
          width="640"
          height="360"
          src="https://www.youtube.com/embed/${id}"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>`
      })
    }
  } while (match)
  return videos
}

const Markdown = ({ content, theme, size }) => {
  const el_markdown = useRef()
  useEffect(() => {
    if (el_markdown.current) {
      marked.use({
        sanitizer: DOMPurify.sanitize,
        renderer: {
          heading(text, level) {
            if (level === 1) {
              return `<h${level}>${text}</h${level}>`
            }
            return `<h${level}>${theme.header_char}${theme.header_char} ${text}</h${level}>`
          },
          link(href, title, text) {
            console.log(href, title, text)
            const info = getVideos(href)
            if (info.length > 0) {
              return `<div class="${bss("video")}">${info[0].iframe}</div>`
            }
            return false
          }
        },
        tokenizer: {}
        /*
        replace youtube url with 

        <iframe
          width="640"
          height="360"
          src={`https://www.youtube.com/embed/${data.video_id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        */
      })

      el_markdown.current.innerHTML = marked(content)
    }
  }, [el_markdown, content, theme])

  return (
    <div
      className={cx(
        bss({ size: size || "full" }),
        css({
          "& h1": {
            color: lightenDarken(theme.secondary, -100),
            backgroundColor:
              size === "full" && `rgba(${hex2rgb(theme.primary).join(",")},0.2)`
          },
          "& a": {
            color: lightenDarken(theme.primary, -50),
            textShadow: `0px 0px 1px ${lightenDarken(theme.primary, -50)}`
          }
        })
      )}
      ref={el_markdown}
    ></div>
  )
}

export default Markdown
