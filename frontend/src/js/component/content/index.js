import React from "react"
import { css, cx } from "emotion"

import { Text, TextMini } from "component/content/text"

import { block } from "style"
import "style/content.scss"

const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const Content = ({ type, title, value, color, size }) => (
  <div className={bss({ size: size || "regular", type })}>
    <div
      className={cx(
        css`
          background-color: #${color || "ECEFF1"};
        `,
        bss("title")
      )}
    >
      {title}
    </div>
    <div
      className={cx(
        css`
          ${color ? `border-color: #${color};` : ""}
        `,
        bss("body")
      )}
    >
      {type === "text" ? (
        size == "small" ? (
          <TextMini value={value} />
        ) : (
          <Text value={value} />
        )
      ) : null}
    </div>
  </div>
)

export default Content
