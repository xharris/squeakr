import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Auth from "component/auth"
import { DndProvider } from "component/dragdrop"
import Button from "component/button"
import PatientEditor from "feature/patient_editor"
import CategoryEditor from "feature/category_editor"
import Container from "@material-ui/core/Container"
import "./App.css"
import "style/index.scss"

const App = () => {
  return (
    <div className="App">
      <DndProvider>
        <Container maxWidth="sm">
          <Router>
            <Auth />
            <Switch>
              <Route path="/" exact>
                <Button label="Categories" to="/categories" />
              </Route>
              <Route path="/categories" exact>
                <CategoryEditor />
              </Route>
              <Route path="/patient/:id">
                <PatientEditor />
              </Route>
            </Switch>
          </Router>
        </Container>
      </DndProvider>
    </div>
  )
}

export default App
