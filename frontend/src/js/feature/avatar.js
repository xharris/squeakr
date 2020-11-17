import React from "react"
import { Link } from "react-router-dom"
import * as url from "util/url"

import { block, cx, css, pickFontColor } from "style"

const bss = block("avatar")

const Avatar = ({ size, user }) => {
  const { display_name, username, avatar, theme } = user
  return (
    <Link
      className={cx(
        bss({ size }),
        css({
          color: pickFontColor(theme.primary),
          border: `3px solid ${theme.primary}`,
          backgroundColor: theme.primary
        })
      )}
      to={user && url.user(user.username)}
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
    </Link>
  )
}

export default Avatar
