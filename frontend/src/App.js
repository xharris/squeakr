import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Auth from "component/auth"
import { DndProvider } from "component/dragdrop"
import PatientEditor from "feature/patient_editor"
import "./App.css"
import "style/index.scss"

const App = () => {
  return (
    <div className="App">
      <DndProvider>
        <Router>
          <Auth />
          <Switch>
            <Route path="/" exact>
              <PatientEditor />
            </Route>
          </Switch>
        </Router>
      </DndProvider>
    </div>
  )
}

export default App
