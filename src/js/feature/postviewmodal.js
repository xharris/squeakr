import React, { useState, useEffect } from "react"
import OverflowDialog from "component/overflowdialog"
import Body from "feature/body"
import Post from "feature/post"
import * as apiPost from "api/post"

import { block, cx, css } from "style"

const bss = block("postviewmodal")

const PostViewModal = ({ data, theme, ...props }) => {
  return (
    <OverflowDialog className={bss()} {...props}>
      <Body
        className={cx(
          bss("body"),
          css({
            height: "auto !important"
          })
        )}
        size="sm"
      >
        <Post data={data} theme={theme} size="full" />
      </Body>
    </OverflowDialog>
  )
}

export default PostViewModal
