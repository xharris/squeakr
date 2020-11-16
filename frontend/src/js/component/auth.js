import React, { useState, useEffect, createContext, useContext } from "react"
import { useLocation, useHistory } from "react-router-dom"
import Cookies from "js-cookie"

import * as apiUser from "api/user"

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
  const [auth, setAuth] = useState()

  const signIn = (id, pwd) =>
    apiUser.login({ id, pwd }).then(data => setAuth(data.data.token))

  const signOut = () => setAuth()

  const signUp = data => apiUser.add(data).then(() => signIn(data.id, data.pwd))

  useEffect(() => {
    if (auth && !user) {
      // check if user should still be logged in
      apiUser
        .verifyToken(auth)
        .then(r => setUser({ ...r.data.data, token: auth }))
        .catch(signOut)
    } else if (!auth && user) {
      setUser()
    }
  }, [location.pathname, user, auth])

  useEffect(() => {
    setAuth(Cookies.get("auth"))
  }, [])

  useEffect(() => {
    if (auth) Cookies.set("auth", auth)
    else Cookies.remove("auth")
  }, [auth])

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
