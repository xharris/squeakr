import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Button from "component/button"
import Text from "component/text"
import { useAuthContext } from "component/auth"
import MenuButton from "component/menubutton"
import GroupEditModal from "feature/groupeditmodal"
import Icon from "component/icon"
import * as apiFollow from "api/follow"
import * as url from "util/url"
import * as apiGroup from "api/group"
import { cx, css, block, lightenDarken } from "style"

const bss = block("group")

const Group = ({ data: _data, name, outlined, hideJoined, linked }) => {
  const { user } = useAuthContext()
  const [data, setData] = useState(_data)
  const [status, fetch, update] = apiFollow.useGroup(
    id => console.log("notif", id) || fetch(id)
  )
  const [showGroupEdit, setShowGroupEdit] = useState()
  const [canView, setCanView] = useState()

  useEffect(() => {
    if (name) apiGroup.get(name).then(res => setData(res.data.doc))
  }, [name, user])

  useEffect(() => {
    setCanView(
      (data && data.privacy === "public") ||
        (status && (status.following || status.owned))
    )
  }, [data, status])

  useEffect(() => {
    if (user && data) fetch(data._id)
  }, [user, data])

  return (
    <div className={bss({ outlined })}>
      {data ? (
        <>
          <div className={bss("left")}>
            {linked ? (
              <Button
                type="link"
                className={bss("name")}
                to={canView ? url.explore({ group: data.name }) : null}
                label={`#${data.name}`}
                target="_blank"
                disabled={!canView}
              />
            ) : (
              <Text className={bss("name")} themed>
                {data.name}
              </Text>
            )}
            <div className={bss("members")}>
              {`${data.members} member${data.members === 1 ? "" : "s"}`}
              {data.privacy === "private" && (
                <Icon icon="Lock" title="This is a private group" />
              )}
            </div>
          </div>
          <div className={bss("right")}>
            {status && !hideJoined && (
              <Button
                className={bss("join")}
                label={
                  status.owned
                    ? "Owner"
                    : status.request
                    ? "Requested!"
                    : status.following
                    ? "Joined!"
                    : data.privacy === "public"
                    ? "Join"
                    : "Request"
                }
                title={data.privacy === "private" && "This is a private group"}
                disabled={status.following || status.request || status.owned}
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
          </div>
        </>
      ) : (
        "loading..."
      )}
    </div>
  )
}

export default Group
