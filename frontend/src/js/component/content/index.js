import React from "react"

import { Text, TextMini } from "component/content/text"

import { block } from "style"
import "style/content.scss"

const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const Content = ({ type, value, size }) => (
  <div className={bss({ size: size || "regular", type })}>
    {type === "text" ? (
      size == "small" ? (
        <TextMini value={value} />
      ) : (
        <Text value={value} />
      )
    ) : null}
  </div>
)

export default Content
