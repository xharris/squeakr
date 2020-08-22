// TODO:
// - expand cards to match page url
// - each content/card has it's own state so that api fetch updates only update that card/content

import React, { useEffect, useState, createContext, useContext } from "react"

import Tags from "component/tags"
import Content from "component/content"
import { IconButton, LinkButton, Icon } from "component/button"
import Form from "component/form"
import ConfirmDialog from "component/modal/confirm"
import AddContentDialog from "component/modal/addcontent"
import TextInput from "component/textinput"
import { CardViewContext } from "view/cardview"

import { useFetch } from "util"
import * as apiCard from "api/card"
import * as apiContent from "api/content"

import { block } from "style"
const bss = block("card")

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

export const CardContext = createContext({ fetch: () => {} })

const Card = ({
  id: _id,
  data: _data,
  expanded: _expanded,
  root,
  depth = 0
}) => {
  const [data, fetchData] = useFetch(() => apiCard.get(id), _data)
  const [expanded, setExpanded] = useState(_expanded)
  const [editing, setEditing] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddContentModal, setShowAddContentModal] = useState(false)
  const { fetch: fetchCards } = useContext(CardViewContext)

  const id = data ? data._id : _id
  const path = `${root || ""}/${id}`
  const looped = path.match(`/${_data ? _data._id : id}/`)

  useEffect(() => {
    if (!_data) fetchData()
  }, [id, _data])

  const Children = ({ children }) => (
    <CardContext.Provider value={{ fetch: fetchData }}>
      {children.map(c => {
        if (typeof c === "string") {
          return (
            <Card
              key={c}
              id={c}
              expanded={false}
              root={path}
              depth={depth + 1}
            />
          )
        }
        return c.type === "card" ? (
          <Card key={c._id} id={c._id} data={c} expanded={false} root={path} />
        ) : (
          <Content
            key={c._id}
            id={c._id}
            {...c}
            onChange={d => apiCard.update(c._id, d).then(fetchData)}
          />
        )
      })}
    </CardContext.Provider>
  )

  return data && path ? (
    data.type === "card" && (
      <div
        className={bss({
          size: expanded ? "regular" : "small",
          root: !root,
          editing
        })}
        data-path={path}
        data-id={id}
      >
        <div className={bss("path")}></div>

        {!editing && (
          <div className={bss("header")}>
            <div className={bss("title")}>
              <Icon key="menu" icon={"Menu"} className={bss("drag")} />
              <LinkButton key="title" onClick={() => setEditing(true)}>
                {data.title}
              </LinkButton>
              {looped ? (
                /* button moves page to where that card is already shown */
                <IconButton
                  key="goto"
                  icon={"ChevronRight"}
                  onClick={() => {
                    // scroll to that card
                    document
                      .querySelector(`.${bss()}[data-id='${id}']`)
                      .scrollIntoView({ behavior: "smooth" })
                  }}
                />
              ) : (
                (!data.small ||
                  !data.small.show ||
                  data.small.show.length < data.children.length) && (
                  /* button hides/shows the rest of this cards children */
                  <IconButton
                    key="expand"
                    icon={expanded ? "ExpandLess" : "ExpandMore"}
                    onClick={() => setExpanded(!expanded)}
                  />
                )
              )}
            </div>
            <IconButton
              className={"addcontent"}
              icon={"Add"}
              variant="contained"
              onClick={() => setShowAddContentModal(true)}
            />
            <AddContentDialog
              open={showAddContentModal}
              onClose={() => setShowAddContentModal(false)}
              onSelect={type => {
                console.log(type)
                apiContent
                  .add(id, {
                    type,
                    title: "title",
                    value: "description"
                  })
                  .then(fetchData)
              }}
            />
            <IconButton
              className={"delete"}
              icon={"Close"}
              onClick={() => setShowDeleteModal(true)}
              rounded
            />
            <ConfirmDialog
              open={showDeleteModal}
              prompt={`Delete card "${data.title}"?`}
              onYes={() => apiCard.remove(id).then(() => fetchCards())}
              onClose={() => setShowDeleteModal(false)}
            />
          </div>
        )}
        {editing && (
          <div className={bss("editcontainer")}>
            <Form
              onSave={d =>
                apiCard
                  .update(id, d)
                  .then(() => fetchData())
                  .then(() => setEditing(false))
              }
              render={({ setField }) => [
                /* button to stop editing card title */
                <IconButton
                  key="back"
                  icon={"ArrowBack"}
                  onClick={() => {
                    setEditing(false)
                  }}
                />,
                <TextInput
                  key="title"
                  onChange={v => setField("title", v)}
                  defaultValue={data.title}
                />
              ]}
            />
          </div>
        )}
        <div className={bss("children")}>
          {!looped && (
            <div className={bss("tags")}>
              <Tags
                tags={getAttributes(data.attributes, "tag")}
                size={expanded ? "regular" : "small"}
              />
            </div>
          )}
          {!looped && data.children && (
            <Children
              children={
                !expanded
                  ? data.children.filter(
                      c =>
                        data.small &&
                        data.small &&
                        data.small.show.includes(c.id)
                    )
                  : data.children || []
              }
            />
          )}
        </div>
      </div>
    )
  ) : (
    <div className={bss({ loading: true })}>loading</div>
  )
}

export default Card
