import React, { useEffect, useState } from "react"
import Body from "feature/body"
import Button from "component/button"
import { useAuthContext } from "component/auth"
import ColorPicker from "component/colorpicker"
import { useParams } from "react-router-dom"
import { useFetch, useUpdate } from "util"
import * as apiUser from "api/user"
import { block, cx, css } from "style"

const bss = block("page_user")

const PageUser = () => {
  const [postModal, setPostModal] = useState(false)
  const { user } = useAuthContext()
  const { id } = useParams()
  const [data, fetch] = useFetch(
    () => apiUser.get(id).then(d => d.data.users[0]),
    "user",
    id
  )
  const [user_theme, updateTheme] = apiUser.useTheme({})

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    console.log(user_theme, data)
  }, [user_theme, data])

  return data ? (
    <div
      className={cx(
        bss(),
        css({
          backgroundColor: data.theme.primary
        })
      )}
    >
      <div
        className={cx(
          bss("header"),
          css({
            backgroundColor: data.theme.secondary
          })
        )}
      >
        <Body className={bss("header_content")}>
          <div className={bss("header_left")}>
            <div className={bss("header_username")}>
              {data.display_name || data.username}
            </div>
          </div>
          <div className={bss("header_right")}>
            {user && user.id === data.id ? (
              [
                <ColorPicker
                  key="color1"
                  defaultValue={data.theme.primary}
                  onChange={e => updateTheme({ primary: e.target.value })}
                />,
                <ColorPicker
                  key="color2"
                  defaultValue={data.theme.secondary}
                  onChange={e => updateTheme({ secondary: e.target.value })}
                />,
                <Button
                  key="add"
                  icon="Add"
                  label="Post"
                  onClick={() => {}}
                  outlined
                />
              ]
            ) : (
              <Button label="Follow" onClick={() => {}} outlined />
            )}
          </div>
        </Body>
      </div>
      <Body className={bss("posts")}>hi</Body>
    </div>
  ) : null
}

export default PageUser
