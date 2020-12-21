import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Button from "component/button"
import Text from "component/text"
import { useAuthContext } from "component/auth"
import MenuButton from "component/menubutton"
import GroupEditModal from "feature/groupeditmodal"
import * as apiFollow from "api/follow"
import * as url from "util/url"
import * as apiGroup from "api/group"
import { cx, css, block, lightenDarken } from "style"

const bss = block("group")

const Group = ({ data: _data, name, outlined, hideJoined, linked }) => {
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [status, fetch, update] = apiFollow.useGroup(() => fetch(data._id))
  const [showGroupEdit, setShowGroupEdit] = useState()

  useEffect(() => {
    if (name) apiGroup.get(name).then(res => setData(res.doc))
  }, [name, user])

  useEffect(() => {
    if (data) fetch(data._id)
  }, [data])

  return (
    <div className={bss({ outlined })}>
      {data ? (
        <>
          <div className={bss("left")}>
            {linked ? (
              <Button
                type="link"
                className={bss("name")}
                to={url.explore({ group: data.name })}
                label={`#${data.name}`}
                target="_blank"
              />
            ) : (
              <Text className={bss("name")} themed>
                {data.name}
              </Text>
            )}
            <div className={bss("members")}>{`${data.members} member${
              data.members === 1 ? "" : "s"
            }`}</div>
          </div>
          {status && (!hideJoined || (!status.following && !status.owned)) && (
            <Button
              className={bss("join")}
              label={
                status.request
                  ? "Requested!"
                  : status.following
                  ? "Joined!"
                  : data.privacy === "public"
                  ? "Join"
                  : "Request"
              }
              title={data.privacy === "private" && "This is a private group"}
              disabled={status.following || status.request}
              outlined={!status.following}
              onClick={() => update(status.following, data._id)}
            />
          )}
          {status && (status.following || status.owned) && (
            <>
              <MenuButton
                title="Settings"
                icon="Settings"
                closeOnSelect
                items={
                  status.owned
                    ? [
                        {
                          label: "Edit group",
                          onClick: () => setShowGroupEdit(true)
                        },
                        {
                          label: "Delete group"
                        }
                      ]
                    : [
                        {
                          label: "Leave group"
                        }
                      ]
                }
              />
              <GroupEditModal
                open={showGroupEdit}
                onClose={setShowGroupEdit}
                data={data}
              />
            </>
          )}
        </>
      ) : (
        "loading..."
      )}
    </div>
  )
}

export default Group
