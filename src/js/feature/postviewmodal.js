import React, { useState, useEffect } from "react"
import OverflowDialog from "component/overflowdialog"
import Body from "feature/body"
import Post from "feature/post"
import * as apiPost from "api/post"

import { block, cx, css } from "style"

const bss = block("postviewmodal")

const PostViewModal = ({ data, id, theme, ...props }) => {
  return (
    <OverflowDialog className={bss()} {...props} closeButton transparent>
      <Post data={data} id={id} theme={theme} size="full" />
    </OverflowDialog>
  )
}

export default PostViewModal
