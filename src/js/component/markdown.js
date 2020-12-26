import React from "react"
import { useThemeContext } from "feature/theme"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import ReactHtmlParser from "react-html-parser"
import Video from "component/video"
import { lookup } from "mime-types"
import { block, cx, css, lightenDarken, pickFontColor } from "style"

const bss = block("markdown")

const re_youtube = /youtu(?:\.be\/([\w-_]+)|be\.com.+(?:v=([\w-_]+)|embed\/(\S+)\?))\??/gi

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
          class="${bss("video")}"
          width="640"
          height="320"
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

const Markdown = ({ content, size, preview }) => {
  const { theme } = useThemeContext()

  const renderers = {
    html: ({ value }) => {
      const videos = getVideos(value)
      return videos.length > 0 ? ReactHtmlParser(videos[0].iframe) : value
    },
    image: ({ src, alt }) => {
      const parts = alt.split("-")
      const type = parts[0]

      if (type.startsWith("video"))
        return (
          <Video
            className={bss("video")}
            source={src}
            type={type}
            preview={preview}
          />
        )
      else return <img className={bss("image")} src={src} alt={alt} />
    },
    link: ({ title, node, children }) => {
      const videos = getVideos(node.url)
      if (videos.length > 0) {
        return ReactHtmlParser(videos[0].iframe)
      }
      const mimetype = lookup(node.url)
      if (mimetype && mimetype.startsWith("image"))
        return <img className={bss("image")} src={node.url} alt={node.url} />

      return preview ? (
        <span className="link" title={title}>
          {children}
        </span>
      ) : (
        <a
          className="link"
          href={node.url}
          rel="noreferrer"
          target="_blank"
          title={title}
        >
          {children}
        </a>
      )
    }
  }

  return (
    <ReactMarkdown
      className={cx(
        bss({ size: size || "full" }),
        css({
          "&, & > *": {
            color: pickFontColor(theme.secondary, theme.secondary, 65)
          },
          "& h1": {
            color: pickFontColor(theme.secondary, theme.secondary, 60),
            backgroundColor: pickFontColor(theme.secondary, theme.secondary, 20)
          },
          "& a, & .link": {
            color: lightenDarken(theme.primary, -30),
            textShadow: `0px 0px 1px ${lightenDarken(theme.primary, -30)}`
          }
        })
      )}
      plugins={[gfm]}
      renderers={renderers}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
