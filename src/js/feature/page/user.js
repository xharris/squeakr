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
  const { user: username } = useParams()
  const [following, follow, fetchFollowing] = apiFollow.useFollowUser(username)
  const [theme, fetchTheme] = apiUser.useTheme(
    () => username && fetchTheme(username)
  )

  useEffect(() => {
    if (username) {
      fetchTheme(username)
    }
  }, [username])

  return username && theme ? (
    <Page className={bss()} title={`${username}`} theme={theme}>
      <Body className={bss("posts")}>
        <PostView query={{ usernames: [username] }} theme={theme} nolimit />
      </Body>
      <PostEditModal open={postModal} onClose={setPostModal} />
    </Page>
  ) : (
    <Page className={bss()}>{`who is ${username}`}</Page>
  )
}

export default PageUser
