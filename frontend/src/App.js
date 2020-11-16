import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthProvider from "component/auth"
import { DndProvider } from "component/dragdrop"
import PageUser from "feature/page/user"
import PagePost from "feature/page/post"
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
            <Switch>
              <Route path="/" exact></Route>
              <Route path="/u/:user">
                <PageUser />
              </Route>
              <Route path="/p/:post">
                <PagePost />
              </Route>
            </Switch>
          </AuthProvider>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
