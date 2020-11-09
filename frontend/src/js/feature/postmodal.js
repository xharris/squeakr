import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import Dialog from "component/modal"

import { block } from "style"

const PostModal = ({ ...props }) => {
  return <Dialog {...props}></Dialog>
}

export default PostModal
