import React, { useEffect, createContext, useContext } from "react"
import { useLocation } from "react-router-dom"
import Cookies from "universal-cookie"

import * as apiUser from "api/user"

const cookies = new Cookies()

const Auth = () => {
  const location = useLocation()

  const signIn = (id, pwd) =>
    apiUser.login({ id, pwd }).then(data => cookies.set("user", data.data))

  const signOut = () => {
    cookies.remove("user")
    console.log("user is NOT logged in")
  }

  useEffect(() => {
    // signIn("user@place.com", "jimbo")
  }, [])

  useEffect(() => {
    const user = cookies.get("user")
    if (user) {
      // check if user should still be logged in
      apiUser
        .verifyToken(user)
        .then(() => console.log("user is logged in"))
        .catch(signOut)
    } else {
      signOut()
    }
  }, [location.pathname])
  return <></>
}

export default Auth
