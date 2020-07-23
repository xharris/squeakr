import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import CardView from "view/card"
import "./App.css"
import "style/index.scss"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/card/:id" children={<CardView />} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
