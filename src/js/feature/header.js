import React, { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import { useAuthContext } from "component/auth"
import Icon from "component/icon"
import Button from "component/button"
import MenuButton from "component/menubutton"
import LoginModal from "feature/loginmodal"
import OverflowDialog from "component/overflowdialog"
import { useThemeContext } from "feature/theme"
import TagInput from "feature/taginput"
import * as url from "util/url"
import { useWindowSize } from "util"
import * as apiFollow from "api/follow"
import Container from "@material-ui/core/Container"
import { block, cx, css, lightenDarken } from "style"

const bss = block("header")

const Header = () => {
  const { theme } = useThemeContext()
  const { user, signOut } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)
  const [tagGroups, fetchTagGroups] = apiFollow.useFollowTagsAll()
  const color = "secondary"

  useEffect(() => {
    if (user) fetchTagGroups()
  }, [user])

  return (
    <header
      className={cx(
        bss(),
        css({
          backgroundColor: theme[color]
        })
      )}
    >
      <Container className={bss("inner")} maxWidth="md">
        <div className={bss("left")}>
          <Button
            className={bss("button")}
            icon="Home"
            type="button"
            to={user ? url.explore() : url.home()}
            color={color}
            bg={color}
          />
          {tagGroups &&
            tagGroups.map(({ tags }) => (
              <Button
                key={tags.map(t => t.value).join(",")}
                className={bss("button")}
                label={tags.map(t => t.value).join(" ")}
                to={url.explore({ tags: tags.map(t => t.value) })}
                color={color}
                bg={color}
              />
            ))}
        </div>
        <div className={bss("right")}>
          {user != null ? (
            <MenuButton
              label={user.username}
              items={[
                { label: "My stuff", to: url.user(user.username) },
                { label: "Settings", to: url.settings(), disabled: true },
                { label: "Log out", onClick: signOut }
              ]}
              closeOnSelect
              color={color}
              bg={color}
            />
          ) : (
            [
              <Button
                key="login"
                className={bss("button")}
                label="Login"
                onClick={() => setShowLogin(true)}
                color={color}
                bg={color}
              />,
              <Button
                key="signup"
                className={bss("button")}
                label="Signup"
                onClick={() => setShowLogin("signup")}
                color={color}
                bg={color}
              />
            ]
          )}
        </div>
      </Container>
      <LoginModal
        open={!!showLogin}
        signUp={showLogin === "signup"}
        onClose={() => setShowLogin(false)}
      />
    </header>
  )
}

export default Header
