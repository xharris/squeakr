import React, { useState } from "react"
import Button from "component/button"
import { useAuthContext } from "component/auth"
import MenuButton from "component/menubutton"
import LoginModal from "feature/loginmodal"
import * as url from "util/url"

import Container from "@material-ui/core/Container"
import { block, cx, css } from "style"

const bss = block("header")

const Header = () => {
  const { user, signOut } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className={bss()}>
      <Container className={bss("inner")} maxWidth="lg">
        <div className={bss("left")}>
          <Button className={bss("button")} icon="Home" to="/" />
          <Button
            className={bss("button")}
            icon="Search"
            to="/search"
            disabled
          />
          <Button
            className={bss("button")}
            label="JoJo Meme"
            to="/explore?tags=jojo,meme"
            disabled
          />
        </div>
        <div className={bss("right")}>
          {user ? (
            <MenuButton
              label={user.username}
              items={[
                { label: "My stuff", to: url.user(user.username) },
                { label: "Settings", to: url.settings(), disabled: true },
                { label: "Log out", onClick: signOut }
              ]}
              closeOnSelect
            />
          ) : (
            [
              <Button
                key="login"
                className={bss("button")}
                label="Login"
                onClick={() => setShowLogin(true)}
              />,
              <Button
                key="signup"
                className={bss("button")}
                label="Signup"
                onClick={() => setShowLogin("signup")}
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
    </div>
  )
}

export default Header
