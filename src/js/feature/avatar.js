import React, { useEffect } from "react"
import Box from "component/box"
import Button from "component/button"
import { Link } from "react-router-dom"
import { useAuthContext } from "component/auth"
import * as url from "util/url"
import * as apiFollow from "api/follow"

import { block, cx, css, pickFontColor } from "style"

const bss = block("avatar")

const Avatar = ({ size, user, theme: _theme, preview, nolink }) => {
  const { user: auth_user } = useAuthContext()
  const { display_name, username, avatar, theme = _theme } = user
  const [following, updateFollowing, fetch] = apiFollow.useFollowUser(username)

  const Container = ({ ...props }) =>
    !nolink ? (
      <Link to={user && !preview && url.user(username)} {...props} />
    ) : (
      <div {...props} />
    )

  const Square = () =>
    avatar == null ? (
      <Container
        className={cx(
          bss("square"),
          css({
            color: pickFontColor(theme.primary),
            borderColor: pickFontColor(theme.primary, theme.primary, 20),
            backgroundColor: theme.primary
          })
        )}
      >
        {display_name.toUpperCase().slice(0, 2)}
      </Container>
    ) : (
      <Container
        className={cx(
          bss("image"),
          css({
            backgroundImage: avatar && `url(${avatar})`
          })
        )}
      />
    )

  useEffect(() => {
    if (size === "full" && username) fetch(username)
  }, [size, username])

  return size === "full" ? (
    <Box className={bss({ size })} color={theme.primary}>
      <Square />
      {user.display_name}
      {auth_user && auth_user.username !== username ? (
        <Button
          className={css({
            height: 40
          })}
          label={following ? "Unfollow" : "Follow"}
          onClick={() => updateFollowing(username)}
          outlined
        />
      ) : (
        <div className={css({ width: 50 })} />
      )}
    </Box>
  ) : (
    <div className={bss({ size })} title={display_name}>
      <Square />
    </div>
  )
}

export default Avatar
