import React, { useEffect, useState, useRef } from "react"
import DOMPurify from "dompurify"
import marked from "marked"

import { block, cx, css, lightenDarken, hex2rgb } from "style"

const bss = block("markdown")

const Markdown = ({ content, theme, size }) => {
  const el_markdown = useRef()
  useEffect(() => {
    if (el_markdown.current) {
      marked.use({
        sanitizer: DOMPurify.sanitize,
        renderer: {
          heading(text, level) {
            const esc_text = text
            if (level === 1) {
              return `<h${level}>${text}</h${level}>`
            }
            return `<h${level}>${theme.header_char}${theme.header_char} ${text}</h${level}>`
          }
        }
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
          }
        })
      )}
      ref={el_markdown}
    ></div>
  )
}

export default Markdown
