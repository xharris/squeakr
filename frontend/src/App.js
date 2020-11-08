import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthProvider from "component/auth"
import { DndProvider } from "component/dragdrop"
import Header from "feature/header"
import PageUser from "feature/page/user"
import "style/index.scss"

const App = () => {
  return (
    <div className="App">
      <Router>
        <DndProvider>
          <AuthProvider>
            <Header />
            <Switch>
              <Route path="/" exact></Route>
              <Route path="/p/:id"></Route>
              <Route path="/u/:id">
                <PageUser />
              </Route>
            </Switch>
          </AuthProvider>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
