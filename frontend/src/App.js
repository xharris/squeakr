import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Card from "component/card"
import "./App.css"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            path="/card/:id"
            render={props => <Card id={props.match.params.id} />}
          />
        </Switch>
      </Router>
    </div>
  )
}

export default App
