import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Auth from "component/auth"
import { DndProvider } from "component/dragdrop"
import Header from "feature/header"
import PatientEditor from "feature/patient_editor"
import CategoryEditor from "feature/category_editor"
import Container from "@material-ui/core/Container"
import "./App.css"
import "style/index.scss"

const App = () => {
  return (
    <div className="App">
      <Router>
        <DndProvider>
          <Header />
          <Container maxWidth="sm">
            <Auth />
            <Switch>
              <Route path="/" exact></Route>
              <Route path="/categories" exact>
                <CategoryEditor />
              </Route>
              <Route path="/patient/:id">
                <PatientEditor />
              </Route>
            </Switch>
          </Container>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
