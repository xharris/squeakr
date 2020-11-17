import React, { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import { useAuthContext } from "component/auth"
import Icon from "component/icon"
import Button from "component/button"
import MenuButton from "component/menubutton"
import LoginModal from "feature/loginmodal"
import OverflowDialog from "component/overflowdialog"
import TagInput from "feature/taginput"
import * as url from "util/url"
import { useWindowSize } from "util"
import Container from "@material-ui/core/Container"
import { block, cx, css, lightenDarken } from "style"

const bss = block("header")

const Header = ({ theme }) => {
  const { user, signOut } = useAuthContext()
  const history = useHistory()
  const [showLogin, setShowLogin] = useState(false)
  const [searching, setSearching] = useState(false)
  const el_btn_search = useRef()
  const el_taginput = useRef()
  const [width] = useWindowSize()
  const [marginLeft, setMarginLeft] = useState(0)
  const color = theme ? theme.secondary : "#ffffff"

  useEffect(() => {
    if (el_btn_search.current) {
      setMarginLeft(el_btn_search.current.getBoundingClientRect().left)
    }
  }, [el_btn_search, width])

  useEffect(() => {
    if (el_taginput.current && !!searching) {
    }
  }, [el_taginput, searching])

  return (
    <header
      className={cx(
        bss(),
        css({
          backgroundColor: lightenDarken(color, 30)
        })
      )}
    >
      <Container className={bss("inner")} maxWidth="lg">
        <div className={bss("left")}>
          <Button className={bss("button")} icon="Home" to="/" color={color} />
          <Button
            className={bss("button")}
            icon="Search"
            color={color}
            onClick={() => {
              setSearching([])
            }}
            ref={el_btn_search}
          />
          {!!searching ? (
            <OverflowDialog open={!!searching} onClose={setSearching}>
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
                  ref={el_taginput}
                  onChange={tags => setSearching(tags)}
                  floatSuggestions
                />
                <Button
                  icon="KeyboardArrowRight"
                  color="#F5F5F5"
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
          ) : (
            <Button
              className={bss("button")}
              label="Dream Journal"
              to={url.explore({ tags: ["Dream", "Journal"] })}
              color={color}
            />
          )}
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
            />
          ) : (
            [
              <Button
                key="login"
                className={bss("button")}
                label="Login"
                onClick={() => setShowLogin(true)}
                color={color}
              />,
              <Button
                key="signup"
                className={bss("button")}
                label="Signup"
                onClick={() => setShowLogin("signup")}
                color={color}
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
