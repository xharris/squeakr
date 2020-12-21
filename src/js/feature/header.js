import React, { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import { useAuthContext } from "component/auth"
import Icon from "component/icon"
import Button from "component/button"
import MenuButton from "component/menubutton"
import LoginModal from "feature/loginmodal"
import GroupEditModal from "feature/groupeditmodal"
import OverflowDialog from "component/overflowdialog"
import SettingsModal from "feature/settingsmodal"
import { useThemeContext } from "feature/theme"
import TagInput from "feature/taginput"
import { useWindowSize } from "util"
import Container from "@material-ui/core/Container"
import ThemeProvider from "feature/theme"
import { block, cx, css, lightenDarken } from "style"
import * as apiFollow from "api/follow"
import * as url from "util/url"

const bss = block("header")

const Header = () => {
  const { user, signOut } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)
  const [groups, fetchGroups] = apiFollow.useGroupsAll()
  const [showGroupEdit, setShowGroupEdit] = useState()
  const [showSettings, setShowSettings] = useState()
  const color = "secondary"
  const opp_color = color === "secondary" ? "primary" : "secondary"

  useEffect(() => {
    fetchGroups()
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
              label={user.username}
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
