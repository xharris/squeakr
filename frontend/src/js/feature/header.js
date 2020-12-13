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
  const history = useHistory()
  const [showLogin, setShowLogin] = useState(false)
  const [searching, setSearching] = useState(false)
  const el_btn_search = useRef()
  const [width] = useWindowSize()
  const [marginLeft, setMarginLeft] = useState(0)
  const [tagGroups, fetchTagGroups] = apiFollow.useFollowTagsAll()

  useEffect(() => {
    if (el_btn_search.current) {
      setMarginLeft(el_btn_search.current.getBoundingClientRect().left)
    }
  }, [el_btn_search, width])

  useEffect(() => {
    if (user) fetchTagGroups()
  }, [user])

  return (
    <header
      className={cx(
        bss(),
        css({
          backgroundColor: lightenDarken(theme.secondary, 10)
        })
      )}
    >
      <Container className={bss("inner")} maxWidth="md">
        <div className={bss("left")}>
          <Button
            className={bss("button")}
            icon="Home"
            to={user ? url.explore() : url.home()}
            color="secondary"
            bg="secondary"
          />
          <Button
            className={bss("button")}
            icon="Search"
            onClick={() => {
              setSearching([])
            }}
            ref={el_btn_search}
            color="secondary"
            bg="secondary"
          />
          <OverflowDialog
            open={searching}
            onClose={setSearching}
            className={css({
              "& > *": {
                justifyContent: "flex-start",
                width: "100%"
              }
            })}
          >
            <div
              className={cx(
                bss("search_container"),
                css({
                  marginLeft
                })
              )}
            >
              <Icon className={css({ color: "#F5F5F5" })} icon="Search" />
              <TagInput
                onChange={value => setSearching(value)}
                width={385}
                floatSuggestions
              />
              <Button
                icon="KeyboardArrowRight"
                color="#F5F5F5"
                bg="#000000"
                className={css({
                  height: "100%",
                  marginLeft: 5
                })}
                onClick={() => {
                  if (searching.length > 0) {
                    history.push(url.explore({ tags: searching }))
                  }
                  setSearching(false)
                }}
                outlined
              />
            </div>
          </OverflowDialog>
          {!searching &&
            tagGroups &&
            tagGroups.map(({ tag_order }) => (
              <Button
                key={tag_order.join(",")}
                className={bss("button")}
                label={tag_order.join(" ")}
                to={url.explore({ tags: tag_order })}
                color="secondary"
                bg="secondary"
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
              color="secondary"
              bg="secondary"
            />
          ) : (
            [
              <Button
                key="login"
                className={bss("button")}
                label="Login"
                onClick={() => setShowLogin(true)}
                color="secondary"
                bg="secondary"
              />,
              <Button
                key="signup"
                className={bss("button")}
                label="Signup"
                onClick={() => setShowLogin("signup")}
                color="secondary"
                bg="secondary"
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
