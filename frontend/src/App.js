import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { DndProvider } from "component/dragdrop"
import CardView from "view/cardview"
import "./App.css"
import "style/index.scss"

function App() {
  return (
    <div className="App">
      <DndProvider>
        <Router>
          <Switch>
            <Route exact path="/" children={<CardView />} />
            <Route path="/card/:id">
              <CardView />
            </Route>
          </Switch>
        </Router>
      </DndProvider>
    </div>
  )
}

export default App
