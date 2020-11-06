import React, { useState } from "react"
import Button from "component/button"
import { useAuthContext } from "component/auth"
import LoginModal from "feature/loginmodal"

import Container from "@material-ui/core/Container"
import { block } from "style"

const bss = block("header")

const Header = () => {
  const { user } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className={bss()}>
      <Container className={bss("inner")} maxWidth="lg">
        <div className={bss("left")}>
          <Button className={bss("button")} icon="Home" to="/" />
        </div>
        <div className={bss("middle")}>
          <Button
            className={bss("button")}
            label="Clients"
            to="/clients"
            disabled
          />
          <Button
            className={bss("button")}
            label="Categories"
            to="/categories"
          />
          <Button
            className={bss("button")}
            label="Office"
            to="/office"
            disabled
          />
        </div>
        <div className={bss("right")}>
          {user ? (
            <Button
              className={bss("button")}
              label={user.username}
              onClick={() => {}}
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
