import React, { useEffect, createContext, useContext } from "react"
import { useLocation } from "react-router-dom"
import Cookies from "universal-cookie"

import * as apiUser from "api/user"

const cookies = new Cookies()

const Auth = () => {
  const location = useLocation()

  const signOut = () => {
    cookies.remove("user")
    console.log("user is NOT logged in")
  }

  useEffect(() => {
    /*
    apiUser
      .login({
        id: "user@place.com",
        pwd: "jimbo"
      })
      .then(data => cookies.set("user", data.data))
      .catch(console.error)
    */
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
