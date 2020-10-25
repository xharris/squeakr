import React from "react"

import { block, cx, css } from "style"

const bss = block("user")

const User = ({ size, data }) => {
  const { username, avatar, color } = data
  return (
    <div
      className={cx(
        bss({ size }),
        css({
          backgroundImage: avatar && `url(${avatar})`,
          backgroundColor: color
        })
      )}
    >
      {avatar == null && (
        <div className={bss("text_avatar")}>
          {username.toUpperCase().slice(0, 2)}
        </div>
      )}
    </div>
  )
}

export default User
