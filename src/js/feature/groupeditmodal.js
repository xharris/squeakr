import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import OverflowDialog from "component/overflowdialog"
import Form from "component/form"
import TextArea from "component/textarea"
import Button from "component/button"
import Separator from "component/separator"
import Input from "component/input"
import Group from "feature/group"
import { capitalize } from "util"
import * as apiGroup from "api/group"

import { block } from "style"

const bss = block("groupeditmodal")

const GroupEditModal = ({ data: defaultValue, withSearch, ...props }) => {
  const [newGroup, setNewGroup] = useState(!withSearch)
  const history = useHistory()
  const [groups, searchGroups] = apiGroup.useSearch()

  return (
    <OverflowDialog className={bss()} closeButton {...props}>
      <div className={bss("header")} key="header">
        {withSearch ? (
          <>
            <Button
              label="Find group"
              underline={!newGroup}
              onClick={() => setNewGroup(false)}
            />
            <Separator />
            <Button
              label="New group"
              underline={newGroup}
              onClick={() => setNewGroup(true)}
            />
          </>
        ) : (
          `${defaultValue ? "Edit" : "New"} Group`
        )}
      </div>
      {newGroup ? (
        <Form
          className={bss("form")}
          data={defaultValue}
          onSave={e =>
            defaultValue
              ? apiGroup.update(e).then(() => history.go(0))
              : apiGroup.create(e).then(() => history.go(0))
          }
        >
          {({ data, setField, Input, Select, SubmitButton }) => [
            <Input
              key="name"
              label="Name"
              name="name"
              defaultValue={data.name}
            />,
            <TextArea
              key="description"
              rows="10"
              cols="40"
              placeholder="Description (optional)"
              defaultValue={data.description}
              onChange={e => setField("description", e.target.value)}
            />,
            <Select
              key="privacy"
              name="privacy"
              defaultValue={data.privacy}
              items={["public", "private"].map(v => ({
                label: capitalize(v),
                value: v
              }))}
            />,
            <SubmitButton
              key="submit"
              label={defaultValue ? "Save" : "Create"}
              outlined
            />
          ]}
        </Form>
      ) : (
        <div className={bss("search_container")}>
          <Input
            width="100%"
            placeholder="search by name or enter invite code..."
            onSubmit={searchGroups}
            submitIcon="Search"
            noWrap
          />
          {groups && (
            <div>
              {groups.map(g => (
                <Group key={g._id} data={g} outlined linked />
              ))}
            </div>
          )}
        </div>
      )}
    </OverflowDialog>
  )
}

export default GroupEditModal
