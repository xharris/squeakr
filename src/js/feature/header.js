import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import Button from "component/button"
import MenuButton from "component/menubutton"
import LoginModal from "feature/loginmodal"
import GroupEditModal from "feature/groupeditmodal"
import SettingsModal from "feature/settingsmodal"
import Container from "@material-ui/core/Container"
import ThemeProvider from "feature/theme"
import { block } from "style"
import * as apiFollow from "api/follow"
import * as url from "util/url"

const bss = block("header")

const Header = () => {
  const { user, signOut } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)
  const [groups, fetchGroups, _, setGroups] = apiFollow.useGroupsAll()
  const [showGroupEdit, setShowGroupEdit] = useState()
  const [showSettings, setShowSettings] = useState()
  const color = "secondary"
  const opp_color = color === "secondary" ? "primary" : "secondary"

  useEffect(() => {
    if (user) fetchGroups()
    else setGroups()
  }, [user])

  return (
    <header className={bss()}>
      <Container className={bss("inner")} maxWidth="md">
        <div className={bss("left")}>
          <Button
            className={bss("button")}
            label="All"
            type="button"
            to={user ? url.explore() : url.home()}
            color={color}
            bg={opp_color}
          />
          {groups &&
            groups.map(({ name }) => (
              <Button
                key={name}
                className={bss("button")}
                label={`#${name}`}
                to={url.explore({ group: name })}
                color={color}
                bg={opp_color}
              />
            ))}
          {user && (
            <Button
              icon="Add"
              title="Create group"
              onClick={() => setShowGroupEdit(true)}
              color={color}
              bg={opp_color}
            />
          )}
        </div>
        <div className={bss("right")}>
          {user != null ? (
            <MenuButton
              label={user.display_name}
              items={[
                { label: "My stuff", to: url.user(user.username) },
                {
                  label: "Settings",
                  onClick: () => setShowSettings(true)
                },
                { label: "Log out", onClick: signOut }
              ]}
              closeOnSelect
              color={color}
              bg={opp_color}
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

      <ThemeProvider>
        <LoginModal
          open={!!showLogin}
          signUp={showLogin === "signup"}
          onClose={() => setShowLogin(false)}
        />
        {user && (
          <GroupEditModal
            withSearch
            open={showGroupEdit}
            onClose={setShowGroupEdit}
          />
        )}
        {user && (
          <SettingsModal open={showSettings} onClose={setShowSettings} />
        )}
      </ThemeProvider>
    </header>
  )
}

export default Header
