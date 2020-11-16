import React from "react"

import { block, cx, css, pickFontColor } from "style"

const bss = block("avatar")

const Avatar = ({ size, user }) => {
  const { display_name, username, avatar, theme } = user
  return (
    <div
      className={cx(
        bss({ size }),
        css({
          color: pickFontColor(theme.primary),
          border: `3px solid ${theme.primary}`,
          backgroundColor: theme.primary
        })
      )}
    >
      {avatar == null ? (
        <div className={bss("text")}>
          {(display_name || username).toUpperCase().slice(0, 2)}
        </div>
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

export default Avatar
