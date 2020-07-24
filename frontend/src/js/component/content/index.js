import React from "react"
import { css, cx } from "emotion"
import { Edit } from "@material-ui/icons"

import IconButton from "component/iconbutton"
import { Text } from "component/content/text"

import { block } from "style"
import "style/content.scss"

const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const Content = ({ type, title, value, color, size }) => {
  const showEditForm = () => {
    console.log("hi")
  }
  return (
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
        {type === "text" ? <Text value={value} /> : null}
      </div>
      <IconButton icon="Edit" onClick={showEditForm} />
    </div>
  )
}

export default Content
