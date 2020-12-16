import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthProvider from "component/auth"
import { DndProvider } from "component/dragdrop"
import SettingsProvider from "component/settings"
import PageHome from "feature/page/home"
import PageUser from "feature/page/user"
import PagePost from "feature/page/post"
import PageExplore from "feature/page/explore"
import "style/index.scss"

/**TODO
 * - opengraph meta tags: https://pastebin.com/uPHJBzGV
 */

const App = () => {
  return (
    <div className="App">
      <Router>
        <DndProvider>
          <AuthProvider>
            <SettingsProvider>
              <Switch>
                <Route path="/" exact>
                  <PageHome />
                </Route>
                <Route path="/u/:user">
                  <PageUser />
                </Route>
                <Route path="/p/:post">
                  <PagePost />
                </Route>
                <Route path="/explore">
                  <PageExplore />
                </Route>
              </Switch>
            </SettingsProvider>
          </AuthProvider>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
