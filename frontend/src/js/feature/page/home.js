import React from "react"
import Page from "."
import PageExplore from "feature/page/explore"
import { useAuthContext } from "component/auth"
import { Redirect } from "react-router-dom"
import { block } from "style"

const bss = block("page_home")

const PageHome = () => {
  const { user } = useAuthContext()
  return user ? (
    <Redirect from="/" to="/explore" />
  ) : (
    <Page className={bss()}></Page>
  )
}

export default PageHome
