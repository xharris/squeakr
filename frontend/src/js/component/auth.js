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
    apiUser.login({ id, pwd }).then(res => setUser({ ...res.data.data }))

  const signOut = () => apiUser.logout().then(res => setUser())

  const signUp = data => apiUser.add(data).then(() => signIn(data.id, data.pwd))

  useEffect(() => {
    // check if user should still be logged in
    apiUser
      .verify()
      .then(r => setUser({ ...r.data.data }))
      .catch(signOut)
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
