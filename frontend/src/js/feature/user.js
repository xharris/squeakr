import React from "react"

import { block, cx, css, pickFontColor } from "style"

const bss = block("user")

const User = ({ size, data }) => {
  const { name, avatar, color } = data
  return (
    <div
      className={cx(
        bss({ size }),
        css({
          color: pickFontColor(color),
          border: `3px solid ${color}`,
          backgroundColor: color
        })
      )}
    >
      {avatar == null ? (
        <div className={bss("text")}>{name.toUpperCase().slice(0, 2)}</div>
      ) : (
        <div
          className={cx(
            bss("image"),
            css({
              backgroundImage: avatar && `url(${avatar})`
            })
          )}
        />
      )}
    </div>
  )
}

export default User
