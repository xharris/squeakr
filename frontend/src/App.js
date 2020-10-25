import React, { useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Auth from "component/auth"
import { DndProvider } from "component/dragdrop"
import CardView from "feature/cardview"

import Story from "feature/story"

import "./App.css"
import "style/index.scss"

const App = () => {
  const [list, setList] = useState(["one", "two"])

  const users = [
    {
      id: 0,
      email: "notme@gmail.com",
      username: "xharris",
      avatar:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3.bp.blogspot.com%2F-AKSESJne4ho%2FW2HG7WyJGpI%2FAAAAAAAAMEo%2FgRjx80NVbWw6xuYJgZAWHNgdQRAIzdfWwCLcBGAs%2Fs1600%2Fteemo-quotes.png&f=1&nofb=1"
    },
    {
      id: 1,
      email: "notme@gmail.com",
      username: "xharris",
      color: "#FFCCBC"
      // avatar: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3.bp.blogspot.com%2F-AKSESJne4ho%2FW2HG7WyJGpI%2FAAAAAAAAMEo%2FgRjx80NVbWw6xuYJgZAWHNgdQRAIzdfWwCLcBGAs%2Fs1600%2Fteemo-quotes.png&f=1&nofb=1"
    }
  ]

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
              <Story
                data={{
                  title: "Fix that bug over there",
                  color: "#009688",
                  blocks: [
                    {
                      id: 0,
                      title: "Tasks",
                      list: [
                        {
                          checked: true,
                          body: "Do this"
                        },
                        {
                          checked: false,
                          body: "Do that"
                        }
                      ],
                      assignee: [users[0]]
                    },
                    {
                      id: 1,
                      title: "Test",
                      list: [
                        {
                          checked: false,
                          body: "UT"
                        },
                        {
                          checked: false,
                          body: "Automation"
                        }
                      ],
                      assignee: [users[1]]
                    }
                  ],
                  modified_by: users[1]
                }}
              />
              <Story
                data={{
                  title: "Enable debugging in 4.2.0",
                  blocks: [
                    {
                      id: 0,
                      title: "Tasks",
                      list: [
                        {
                          checked: false,
                          body: "get more info"
                        }
                      ],
                      assignee: []
                    }
                  ]
                }}
              />
            </Route>
          </Switch>
        </Router>
      </DndProvider>
    </div>
  )
}

export default App
