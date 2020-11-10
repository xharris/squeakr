/**
 * TODO:
 * - change page text color depending on bg color
 */
import React, { useEffect, useState } from "react"
import Body from "feature/body"
import Button from "component/button"
import { useAuthContext } from "component/auth"
import ColorPicker from "component/colorpicker"
import PostModal from "feature/postmodal"
import Post from "feature/post"
import { useParams } from "react-router-dom"
import { useFetch, useUpdate } from "util"
import * as apiUser from "api/user"
import * as apiPost from "api/post"
import { block, cx, css } from "style"

const bss = block("page_user")

const PageUser = () => {
  const [postModal, setPostModal] = useState()
  const { user } = useAuthContext()
  const { id } = useParams()
  const [data, fetch] = useFetch(
    () => apiUser.get(id).then(d => d.data.users[0]),
    "user",
    id
  )
  const [theme, updateTheme, setTheme] = apiUser.useTheme()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch().then(res => setTheme(res.theme))
    apiPost.getUser(id).then(res => setPosts(res.docs))
  }, [])

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
                  onClick={() => setPostModal(true)}
                  outlined
                />
              ]
            ) : (
              <Button label="Follow" onClick={() => {}} outlined />
            )}
          </div>
        </Body>
      </div>
      <Body className={bss("posts")}>
        {posts.map(p => (
          <Post data={p} key={p._id} theme={theme || data.theme} />
        ))}
      </Body>
      <PostModal open={postModal} onClose={setPostModal} />
    </div>
  ) : null
}

export default PageUser
