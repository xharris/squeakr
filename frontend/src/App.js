import React, { useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Auth from "component/auth"
import { DndProvider, DndList } from "component/dragdrop"
import CardView from "feature/cardview"

import "./App.css"
import "style/index.scss"
import { css } from "style"

const App = () => {
  const [list, setList] = useState(["one", "two"])

  const dnd_style = css`
    border: 1px solid black;
    width: 100px;
    padding: 2px;
  `
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
              <DndList
                onListChange={data => {
                  setList(data)
                  console.log(data)
                }}
                type="test"
              >
                {list.map(item => (
                  <div className={dnd_style} id={item} key={item}>
                    {item}
                  </div>
                ))}
              </DndList>
            </Route>
          </Switch>
        </Router>
      </DndProvider>
    </div>
  )
}

export default App
