import React, { useState, useEffect, createContext, useContext } from "react"
import { useLocation, useHistory } from "react-router-dom"
import Cookies from "universal-cookie"

import * as apiUser from "api/user"

const cookies = new Cookies()

const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  user: null
})

export const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const location = useLocation()
  const history = useHistory()
  const [user, setUser] = useState()

  const signIn = (id, pwd) =>
    apiUser.login({ id, pwd }).then(data => {
      cookies.set("user", data.data)
      history.go(0)
      return data
    })

  const signOut = () => {
    cookies.remove("user")
    setUser()
    history.go(0)
  }

  const signUp = data => apiUser.add(data).then(() => signIn(data.id, data.pwd))

  useEffect(() => {
    const user_cookie = cookies.get("user")
    if (user_cookie) {
      // check if user should still be logged in
      apiUser.verifyToken(user_cookie).then(r => setUser(r.data.data))
      // .catch(signOut)
    } else if (user) {
      signOut()
    }
  }, [location.pathname])
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
