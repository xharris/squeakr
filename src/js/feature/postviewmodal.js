import React, { useState, useEffect } from "react"
import OverflowDialog from "component/overflowdialog"
import Body from "feature/body"
import Post from "feature/post"
import * as apiPost from "api/post"

import { block, cx, css } from "style"

const bss = block("postviewmodal")

const PostViewModal = ({ data, id, theme, onDeletePost, ...props }) => {
  return (
    <OverflowDialog className={bss()} {...props} closeButton transparent>
      <Post id={id} theme={theme} size="full" onDelete={onDeletePost} />
    </OverflowDialog>
  )
}

export default PostViewModal
