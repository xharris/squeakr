/**
 * TODO:
 * - change page text color depending on bg color
 */
import React, { useEffect, useState, useCallback } from "react"
import Page from "."
import Body from "feature/body"
import PostEditModal from "feature/posteditmodal"
import PostView from "feature/postview"
import { useParams } from "react-router-dom"
import * as apiUser from "api/user"
import { block } from "style"
import { useListen } from "util"

const bss = block("page_user")

const PageUser = () => {
  const [postModal, setPostModal] = useState()
  const { user: username } = useParams()
  const [dispName, setDispName] = useState()
  const [theme, setTheme] = useState()

  const fetchUser = name => {
    if (name) {
      apiUser.get([username]).then(res => {
        setDispName(res.data.users[0].display_name)
        setTheme(res.data.users[0].theme)
      })
      console.log("get it")
    }
  }

  useListen("user/update-theme", username, () => fetchUser(username))

  useEffect(() => {
    fetchUser(username)
  }, [username])

  return dispName && theme ? (
    <Page className={bss()} title={`${dispName}`} theme={theme}>
      <Body className={bss("posts")}>
        <PostView
          query={{ usernames: [{ value: username, label: dispName }] }}
          theme={theme}
          nolimit
        />
      </Body>
      <PostEditModal open={postModal} onClose={setPostModal} />
    </Page>
  ) : (
    <Page className={bss()}>{`who is ${username}`}</Page>
  )
}

export default PageUser
