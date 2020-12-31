import React, { useEffect } from "react"
import { useThemeContext } from "feature/theme"
import ReactMarkdown from "react-markdown"
import Video from "component/video"
import Link from "component/link"
import { lookup } from "mime-types"
import gfm from "remark-gfm"
import { block, cx, css, lightenDarken, pickFontColor } from "style"

const bss = block("markdown")

const Markdown = ({ content, size, preview }) => {
  const { theme } = useThemeContext()

  const renderers = {
    text: props => {
      //console.log("text", props)
      return (
        <Link
          className={bss("text")}
          color="primary"
          newtab
          preview={preview}
          href={props.value}
          {...props}
        />
      )
    },
    image: ({ src, ...props }) => {
      //console.log("image", { src, ...props })
      return (
        <Link
          className={bss("image")}
          color="primary"
          preview={preview}
          newtab
          href={src}
          scrape
          {...props}
        />
      )
    },
    link: props => {
      //console.log("link", props)
      return (
        <Link
          className={bss("link")}
          color="primary"
          preview={preview}
          newtab
          scrape
          {...props}
        />
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
      // plugins={[gfm]}
      renderers={renderers}
    >
      {content.replace(/(?:\r\n|\r|\n)/gi, "\n\n")}
    </ReactMarkdown>
  )
}

export default Markdown
