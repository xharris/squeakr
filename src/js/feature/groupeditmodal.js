import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import OverflowDialog from "component/overflowdialog"
import Form from "component/form"
import TextArea from "component/textarea"
import Button from "component/button"
import Input from "component/input"
import Group from "feature/group"
import TabView from "component/tabview"
import Avatar from "feature/avatar"
import { capitalize } from "util"
import * as apiGroup from "api/group"
import * as apiUser from "api/user"

import { block } from "style"

const bss = block("groupeditmodal")

const GroupEditModal = ({ data: defaultValue, withSearch, ...props }) => {
  const history = useHistory()
  const [groups, searchGroups] = apiGroup.useSearch()
  const [users, searchUsers] = apiUser.useSearch()

  const EditForm = () => (
    <Form
      className={bss("form")}
      data={defaultValue}
      onSave={e =>
        defaultValue
          ? apiGroup.update(e).then(() => history.go(0))
          : apiGroup.create(e).then(() => history.go(0))
      }
    >
      {({ data, setField, Input, Select, SubmitButton, Group }) => (
        <Group title={defaultValue ? "Edit group" : "Create group"}>
          <Input label="Name" name="name" defaultValue={data.name} />
          <TextArea
            rows="10"
            cols="40"
            placeholder="Description (optional)"
            defaultValue={data.description}
            onChange={e => setField("description", e.target.value)}
          />
          <Select
            name="privacy"
            defaultValue={data.privacy}
            items={["public", "private"].map(v => ({
              label: capitalize(v),
              value: v
            }))}
          />
          <SubmitButton label={defaultValue ? "Save" : "Create"} outlined />
        </Group>
      )}
    </Form>
  )

  return (
    <OverflowDialog className={bss()} closeButton {...props}>
      {withSearch ? (
        <TabView
          tabs={[
            { label: "Find group" },
            { label: "Find user" },
            { label: "New group" }
          ]}
          content={[
            // find group
            () => (
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
            ),
            // find user
            () => (
              <div className={bss("search_container")}>
                <Input
                  width="100%"
                  placeholder="search by username..."
                  onSubmit={searchUsers}
                  submitIcon="Search"
                  noWrap
                />
                {users && (
                  <div>
                    {users.map(u => (
                      <Avatar key={u._id} user={u} size="full" />
                    ))}
                  </div>
                )}
              </div>
            ),
            // new group
            () => <EditForm />
          ]}
        />
      ) : (
        <EditForm />
      )}
    </OverflowDialog>
  )
}

export default GroupEditModal
