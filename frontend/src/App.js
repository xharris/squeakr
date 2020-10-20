import React, { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Auth from "component/auth"
import { DndProvider } from "component/dragdrop"
import CardView from "feature/cardview"

import "./App.css"
import "style/index.scss"

const App = () => {
  return (
    <div className="App">
      <DndProvider>
        <Router>
          <Auth />
          <Switch>
            <Route path="/" exact children={<CardView />} />
            <Route path="/card/:id">
              <CardView />
            </Route>
            <Route path="/test" exact>
              hi
            </Route>
          </Switch>
        </Router>
      </DndProvider>
    </div>
  )
}

export default App
