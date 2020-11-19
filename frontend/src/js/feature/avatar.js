import React from "react"
import { Link } from "react-router-dom"
import * as url from "util/url"

import { block, cx, css, pickFontColor } from "style"

const bss = block("avatar")

const Avatar = ({ size, user, theme: _theme, preview }) => {
  const { display_name, username, avatar, theme = _theme } = user

  const Container = ({ to, ...props }) =>
    to ? <Link to={to} {...props} /> : <div {...props} />

  return (
    <Container
      className={cx(
        bss({ size }),
        css({
          color: pickFontColor(theme.primary),
          border: `3px solid ${theme.primary}`,
          backgroundColor: theme.primary
        })
      )}
      to={user && !preview && url.user(user.username)}
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
    </Container>
  )
}

export default Avatar
