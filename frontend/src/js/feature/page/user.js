/**
 * TODO:
 * - change page text color depending on bg color
 */
import React, { useEffect, useState } from "react"
import Page from "."
import Body from "feature/body"
import Button from "component/button"
import { useAuthContext } from "component/auth"
import ColorPicker from "component/colorpicker"
import PostEditModal from "feature/posteditmodal"
import PostView from "feature/postview"
import ThemeProvider from "feature/theme"
import { useParams, Link } from "react-router-dom"
import { useFetch, useUpdate } from "util"
import * as apiUser from "api/user"
import * as apiPost from "api/post"
import * as apiFollow from "api/follow"
import * as url from "util/url"
import { block, cx, css, pickFontColor } from "style"

const bss = block("page_user")

const PageUser = () => {
  const [postModal, setPostModal] = useState()
  const { user } = useAuthContext()
  const { user: user_id } = useParams()
  const [data, fetch] = useFetch(
    uid => apiUser.get(uid).then(d => d.data.users[0]),
    "user",
    user_id
  )

  const [following, follow, fetchFollowing] = apiFollow.useFollowUser(user_id)

  const [theme, updateTheme, setTheme] = apiUser.useTheme()

  useEffect(() => {
    fetchFollowing()
  }, [])

  useEffect(() => {
    if (user_id) {
      fetch(user_id).then(res => setTheme(res.theme))
    }
  }, [user_id])

  return data && theme ? (
    <ThemeProvider theme={theme}>
      <Page className={bss()}>
        <div
          className={cx(
            bss("header"),
            css({
              backgroundColor: theme.secondary
            })
          )}
        >
          <Body className={bss("header_content")}>
            <div className={bss("header_left")}>
              <Link
                to={url.user(data.username)}
                className={cx(
                  bss("header_username"),
                  css({
                    color: pickFontColor(theme.secondary, theme.secondary)
                  })
                )}
              >
                {data.display_name || data.username}
              </Link>
            </div>
            <div className={bss("header_right")}>
              {user && user.id === data.id ? (
                [
                  <ColorPicker
                    key="color1"
                    defaultValue={theme.primary}
                    title="Choose a primary color"
                    onChange={e => updateTheme({ primary: e.target.value })}
                  />,
                  <ColorPicker
                    key="color2"
                    defaultValue={theme.secondary}
                    title="Choose a secondary color"
                    onChange={e => updateTheme({ secondary: e.target.value })}
                  />,
                  <Button
                    key="add"
                    icon="Add"
                    label="Post"
                    onClick={() => setPostModal(true)}
                    color="secondary"
                    bg="secondary"
                    outlined
                  />
                ]
              ) : (
                <Button
                  label={following ? "Unfollow" : "Follow"}
                  onClick={() => follow(data.username)}
                  color="secondary"
                  bg="secondary"
                  outlined
                />
              )}
            </div>
          </Body>
        </div>
        <Body className={bss("posts")}>
          <PostView query={{ usernames: [user_id] }} theme={theme} nolimit />
        </Body>
        <PostEditModal open={postModal} onClose={setPostModal} />
      </Page>
    </ThemeProvider>
  ) : (
    <Page className={bss()}>{`who is ${user_id}`}</Page>
  )
}

export default PageUser
