import React from "react"
import Page from "."
import PageExplore from "feature/page/explore"
import Body from "feature/body"
import PostView from "feature/postview"
import { useAuthContext } from "component/auth"
import { Redirect } from "react-router-dom"
import { block } from "style"

const bss = block("page_home")

const PageHome = () => {
  const { user } = useAuthContext()
  return user ? (
    <Redirect from="/" to="/explore" />
  ) : (
    <Page className={bss()}>
      <Body>
        <PostView />
      </Body>
    </Page>
  )
}

export default PageHome
